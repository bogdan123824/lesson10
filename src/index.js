import React, { useState } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import P from 'react-pagimagic';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center'
};

const App = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  const handleSearch = () => {
    if(search === ''){
      alert('Введіть будь ласка номер або VIN');
      return;
    }
    setLoad(true);
    setData([]);

    const url = `https://baza-gai.com.ua/nomer/${search}`;
    const key = "c9fac9bee7ec8ba2f26a932d75d7c814";

    axios.get(url, {
      headers: {
        "Accept": "application/json",
        "X-Api-Key": key
      }
    })
    .then(response => {
      const { vendor, model, model_year, photo_url, operations } = response.data;

      if (operations && operations.length > 0) {

        const allData = operations.map(operation => {
         return{
          vendor: vendor,
          model: model,
          model_year: model_year,
          photo_url: photo_url,
          registered_at: operation.registered_at,
          color: operation.color,
          fuel: operation.fuel,
          operation: operation.operation
         }; 
        });
        setData(allData);
      }
    })
    .finally(() => {
      setLoad(false);
    });
  };

  const renderChildren = (list) => list.map((item, index) => (
    <div key={index} style={{ border: '1px solid gray', margin: '10px' }}>
      <h4>{item.vendor} {item.model}</h4>
      <img src={item.photo_url} style={{ width: '600px', height: '400px', border:'2px solid gray', borderRadius: '5px' }} />
      <p>Рік: {item.model_year}</p>
      <p>Колір: {item.color.ru}</p>
      <p>Тип палива: {item.fuel.ru}</p>
      <p>Тип операції: {item.operation.ru}</p>
      <p>Дата реєстрації: {item.registered_at}</p>
    </div>
  ));

  return (
    <div style={styles}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '20px' }}>
      <input
        style={{
        appearance: 'none',
        border: 'none',
        outline: 'none',
        borderBottom: '5px solid yellow',
        background: 'skyblue', 
        borderRadius: '2px 2px 0 0',
        padding: '4px',
        color: 'black',
      }}
      type='text'
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder='Введіть номер або VIN'
    />
  <button onClick={handleSearch} style={{ borderRadius: '5px', padding: '5px 10px',backgroundImage: 'linear-gradient(to bottom right, skyblue 50%, yellow 50%)', }}>Пошук</button>
    </div>
      {load && <div>Завантаження! Будь ласка зачекайте</div>}
      {!load && data.length > 0 && (
        <P
          list={data}
          itemsPerPage={1}
          currentPageIndex={0}
          maximumVisiblePaginators={5}
          renderChildren={renderChildren}
          useDefaultStyles
          showCounter
        />
      )}
      <hr />
    </div>
  );
}

render(<App />, document.getElementById('root'));

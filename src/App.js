import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return JSON.parse(localStorage.getItem('list'));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  const handleSubmit = e => {
    e.preventDefault();
    if (!name) {
      //display alert:
      // setAlert({ show: true, msg: 'please enter value', type: 'danger' });
      showAlert(true, 'please enter value', 'danger');
    } else if (name && isEditing) {
      //display with edit:
      setList(
        list.map(item => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'value changed', 'success');
    } else {
      //show alert:
      showAlert(true, 'item add to the list', 'success');
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName('');
    }
  };

  // pravimo alert:
  const showAlert = (show = false, msg = '', type = '') => {
    setAlert({ show, msg, type });
  };
  // da izbrisemo sve iteme:
  const clearList = () => {
    showAlert(true, 'empty list', 'danger');
    setList([]);
  };
  // da izbrisemo pojedinacno item:
  const removeItem = id => {
    showAlert(true, 'item removed', 'danger');
    setList(list.filter(item => item.id !== id));
  };
  // da editujemo item:
  const editItem = id => {
    const specificItem = list.find(item => item.id === id);
    console.log(specificItem);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  // LOCAL STORAGE:
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert && (
          <Alert {...alert} removeAlert={showAlert} list={list}></Alert>
        )}
        <h3>grocery bud</h3>
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='e. g. eggs'
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem}></List>
          <button className='clear-btn' onMouseDown={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;

// go over slice - createApi - set fetchBaseQuery - individual queries/Methods - hooks created - imported and destructured in component
// first return all DATA/ renamed "todos"
// further destructured methods to make easier
// each method is essentially some functionality within the form
// input - update - trash button etc.

// invalidated previous cache - it sets the initial state(data) but then does not know to refresh
// we set 'tagTypes' in the reducer params - WHICH MUTATIONS INVALIDATE THE CACHE
// then when we get all todos we 'provide those tags'
// and when we perform a CRUD opp. we 'invalidate' or refresh
// add the sorting method - 'transformResponse' & 'B - A' for descending

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
//
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from '../api/apiSlice';

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('');

  // destructure hooks - data is named 'todos'
  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery();

  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleSubmit = e => {
    e.preventDefault();
    addTodo({ userId: 1, title: newTodo, completed: false });
    // updateTodo({todo})
    // deleteTodo({id})
    setNewTodo('');
  };
  // CREATE NEW TODO
  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
      </div>
      <button className="submit">
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );
  // in form we'll map the todos - return an input w checkbox and trash icon
  // listen for the onChange to update or button click to delete
  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = todos.map(todo => {
      //JSON.stringify(todos)
      return (
        <article key={todo.id}>
          <div className="todo">
            <input
              type="checkbox"
              checked={todo.completed}
              id={todo.id}
              onChange={() =>
                updateTodo({ ...todo, completed: !todo.completed })
              }
            />
            <label htmlFor={todo.id}>{todo.title}</label>
          </div>
          <button className="trash" onClick={() => deleteTodo({ id: todo.id })}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </article>
      );
    });
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <main>
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};
export default TodoList;

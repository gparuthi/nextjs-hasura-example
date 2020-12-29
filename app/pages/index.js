import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { client } from '../lib/apolloClient';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from "next/router"

const Query = gql`
query Todos {
  todos {
    id, 
    value
  }
}
`
const AddTodoQuery = gql`
mutation AddTodo($value: String = "") {
  insert_todos_one(object: {value: $value}) {
    id
    value
  }
}`

const DelTodoQuery = gql`
mutation DelTodo($id: uuid!) {
  delete_todos_by_pk(id: $id) {
    id
    value
  }
}
`


export default function Home() {
  const router = useRouter()
  const { loading, error, data, refetch } = useQuery(Query);
  const [updateTodo] = useMutation(AddTodoQuery, { onCompleted: ()=>refetch() });
  const [delTodo] = useMutation(DelTodoQuery, { onCompleted: ()=>refetch() });


  let todoInput

  const onAdd = (e) => {
    e.preventDefault()
    console.log(todoInput.value)
    updateTodo({ variables: { value: todoInput.value } })
    todoInput.value = ""
  }
  const onDel = (id) => {
    console.log(id)
    delTodo({ variables: { id: id } })
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className={styles.container}>
      <div className="box"></div>
      <h1>TODOS</h1>
      <hr />
      {data.todos.map(t =>
        <div key={t.id} className="todo">
          <div>{t.value}</div>
          <button onClick={() => onDel(t.id)}>x</button>
        </div>)
      }
      <hr />
      <input type='text' placeholder='Enter TODO'
        ref={el => todoInput = el} /> <button onClick={onAdd}>+</button>
      <style jsx>
        {`
        .todo{
          margin: 10px;
    border-style: dashed;
    padding: 10px;
    width: 200px;
    display: flex;
    justify-content: space-between;
          
        }
          .box {
            margin: 20px
          }
        `}
      </style>
    </div>
  )
}

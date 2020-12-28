import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { client } from '../lib/apolloClient';
import { gql, useQuery } from '@apollo/client';

const Query = gql`
query Todos {
  todos {
    id, 
    value
  }
}
`
client
  .query({
    query: Query
  })
  .then(result => console.log(result.data.todos));

export default function Home() {
  const { loading, error, data } = useQuery(Query);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className={styles.container}>
      <div>TODOS:</div>
      {data.todos.map(t=><div>{t.value}</div>)}
    </div>
  )
}

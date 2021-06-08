import styles from '../styles/Index.module.css'
import Link from 'next/link'
export const getStaticProps = async (context) => {
  const res = await fetch('https://eshop-deve.herokuapp.com/api/v2/orders', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYyMDY2Mjk4NjIwM30.lhfzSXW9_TC67SdDKyDbMOYiYsKuSk6bG6XDE1wz2OL4Tq0Og9NbLMhb0LUtmrgzfWiTrqAFfnPldd8QzWvgVQ',
        'Content-type': 'application/json'
      }
    })
    const {orders} = await res.json()
  return {
    props: {
      orders
    }
  }
}
export default function Home({orders}) {
  console.log(orders)
  return (
    <div className={styles.container}>
      <h1>Orders:</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableh}>Order ID</th>
            <th className={styles.tableh}>Number</th>
          </tr>
        </thead>
        <tbody>
          {
            orders.map((order) => {
              return (
                <tr key={order.id}>
                  <td><Link href={`/order/${order.id}`}><a className={styles.tabled}>{order.id}</a></Link></td>
                  <td>{order.number}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

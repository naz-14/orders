import Link from 'next/link'
import { useRef, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import useForm from '../../hooks/useForm'
import styles from '../../styles/Order.module.css'

export const getStaticPaths = async () => {
  const res = await fetch('https://eshop-deve.herokuapp.com/api/v2/orders', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYyMDY2Mjk4NjIwM30.lhfzSXW9_TC67SdDKyDbMOYiYsKuSk6bG6XDE1wz2OL4Tq0Og9NbLMhb0LUtmrgzfWiTrqAFfnPldd8QzWvgVQ',
        'Content-type': 'application/json'
      }
    })
  const {orders} = await res.json()
  const paths = orders.map(order => {
    return {
      params: { id: order.id }
    }
  })
  return {
    paths,
    fallback: false
  }
}
export const getStaticProps = async (context) => {
  const id = context.params.id
  const res = await fetch('https://eshop-deve.herokuapp.com/api/v2/orders', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYyMDY2Mjk4NjIwM30.lhfzSXW9_TC67SdDKyDbMOYiYsKuSk6bG6XDE1wz2OL4Tq0Og9NbLMhb0LUtmrgzfWiTrqAFfnPldd8QzWvgVQ',
        'Content-type': 'application/json'
      }
    })
  const {orders} = await res.json()
  const info = orders.find(order => order.id === id)
  return {
    props: {
      order: info
    }
  }
}

const Order = ({order}) => {
  const fromInitialValues = {
    sku: '',
    name: '',
    quantity: '',
    price: ''
  }
  const {items} = order
  const [total, setTotal] = useState(parseInt(order.totals.total))
  const [values, handleInputChange, resetForm] = useForm(fromInitialValues)
  const [errors, setErrors] = useState({
    sku: false,
    name: false,
    quantity: false,
    price: false
  })
  const [showAlert, setShowAlert] = useState(false)
  const sku = useRef(null)
  const name = useRef(null)
  const quantity= useRef(null)
  const price= useRef(null)
  const tbody= useRef(null)
  const PayAlert = withReactContent(Swal)
  const handleSubmit = (e) => {
    e.preventDefault()
    if(values.sku.trim() === '') {
      setErrors({
        ...errors,
        sku: true
      })
      return
    } else if(values.name.trim() === '') {
      setErrors({
        ...errors,
        name: true
      })
      return
    } else if(values.quantity.trim() === '') {
      setErrors({
        ...errors,
        quantity: true
      })
      return
    } else if(values.name.trim() === '') {
      setErrors({
        ...errors,
        name: true
      })
      return
    }
    createNewElement()
    updateTotal()
  }
  const createNewElement = () => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${values.sku}</td>
      <td>${values.name}</td>
      <td>${values.quantity}</td>
      <td>${values.price}</td>
    `
    tbody.current.appendChild(tr)
    resetForm()
  }
  const updateTotal = () => {
    setTotal(total + (parseInt(values.price) * parseInt(values.quantity)))
  }
  const handleBlur = (e) => {
    e.target.value !== '' ? setErrors({...errors , [e.target.name]: false}) : undefined
  }
  const handlePay = () => {
    PayAlert.fire({
      title: <p>Payment Confirmed</p>,
      footer: 'Thanks for your payment',
    })
  }
  return (
    <div className={styles.container}>
      <h1>Order: {order.number}</h1>
      <h2>Items:</h2>
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th className={styles.tableh}>SKU</th>
              <th className={styles.tableh}>Name</th>
              <th className={styles.tableh}>Quantinty</th>
              <th className={styles.tableh}>Price</th>
            </tr>
          </thead>
          <tbody ref={tbody}>
            {
              items.map((item) => {
                return (
                  <tr key={item.sku}>
                    <td>{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      <h2>Add a new Item</h2>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.formInputWrapper}>
          <label className={styles.formLabel} htmlFor="sku">SKU:</label>
          <input
            className={`${styles.formInput} ${errors.sku ? styles.error : ''}`}
            name="sku"
            placeholder="sku005"
            onChange={(e)=>{handleInputChange(e)}}
            value={values.sku}
            onBlur={handleBlur}
            ref={sku}
          />
          {errors.sku && <div className={styles.errorText}>This field it's required</div>}
        </div>
        <div className={styles.formInputWrapper}>
          <label className={styles.formLabel} htmlFor="name">Name:</label>
          <input
            className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
            name="name"
            placeholder="Product Name"
            type="text"
            onChange={(e)=>{handleInputChange(e)}}
            value={values.name}
            onBlur={handleBlur}
            ref={name}
          />
          {errors.name && <div className={styles.errorText}>This field it's required</div>}
        </div>
        <div className={styles.formInputWrapper}>
          <label className={styles.formLabel} htmlFor="quantity">Quantinty:</label>
          <input
            className={`${styles.formInput} ${errors.quantity ? styles.error : ''}`}
            name="quantity"
            placeholder="1"
            type="number"
            onChange={(e)=>{handleInputChange(e)}}
            value={values.quantity}
            onBlur={handleBlur}
            ref={quantity}
          />
          {errors.quantity && <div className={styles.errorText}>This field it's required</div>}
        </div>
        <div className={styles.formInputWrapper}>
          <label className={styles.formLabel} htmlFor="price">Price:</label>
          <input
            className={`${styles.formInput} ${errors.price ? styles.error : ''}`}
            type="number"
            name="price"
            placeholder="8000"
            onChange={(e)=>{handleInputChange(e)}}
            value={values.price}
            onBlur={handleBlur}
            ref={price}
          />
          {errors.price && <div className={styles.errorText}>This field it's required</div>}
        </div>
        <button className={styles.button}>Add Item</button>
      </form>
      <div className={styles.totalWrapper}>
        <h2 className={styles.total}>Total:</h2>
        <p className={styles.totalPrice}>${total}</p>
      </div>
      <button className={styles.payButton} onClick={() => { handlePay() }}>Pay</button>
      <Link href='/'><a className={styles.goBack}>Go back to the Orders</a></Link>
    </div>
  )
}

export default Order
import { useState } from "react"

const useForm = (props) => {
  console.log(props)
  const [values, setValues] = useState(props)
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }
  const resetForm = () => {
    setValues({...props})
  }
  return [
    values,
    handleChange,
    resetForm
  ]
}
export default useForm
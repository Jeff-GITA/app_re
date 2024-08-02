
import PropTypes from 'prop-types'
import Button from './Button'

const Header = ({title, onAdd, showAdd}) => {
  return (
    <header className="header">
      {/* <h1 style={headingStyle}>Task Tracker</h1> */}
      <h1>title</h1>
      <Button color={showAdd ? "black": "green"} text={showAdd ? "Close" : "Add"} onClick={onAdd}/>
      {/* <Button color="red" text="Bye" /> */}
      {/* <h2>Hello {title}, good evening!</h2> */}
      {/* <button className="btn">Add</button> */}
    </header>
  )
}

// const headingStyle = {
//     color:"red", 
//     backgroundColor:"black",
// }


Header.propTypes = {
    title: PropTypes.string.isRequired,
}

export default Header

import  React , {useEffect,useState} from 'react'
import axios from 'axios';
import Pagination from './components/Pagination';
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import './App.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function App() {
  const [data,setData]=useState([]);
  const [value,setValue]=useState([]);
  const [sortValue,setSortValue]=useState([]);
  const [loading,setLoading]=useState(false);
  const [displayImage,setDisplayImage]=useState(false);
  const [imagePath,setImagePath]=useState('');
  const [currentPage,setCurrentPage]=useState(1);
  const [itemPerPage]=useState(3);


  const sortOptions=['username','ID','full_name','email'];


  useEffect(()=>{
    setLoading(true)
    loadCustomerData();

  },[]);

  // Get current posts
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItem = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);
  const loadCustomerData= async()=> {

    return await axios.get("http://localhost:5000/customers").then((response) => setData(response.data)).catch((err) => console.log(err))
    setLoading(false)
    console.log( currentItem)
    
  }
  const handleSearch = (value)=> {
    setValue(value)
    let allCustomer=data
  
    let val = value.toLowerCase();
    let matches = (value!='') ?  data.filter(item => item.username.toLowerCase().includes(val)
    || item.full_name.toLowerCase().includes(val)
    || item.email.toLowerCase().includes(val)
    
    ) : '';
   
    (matches!='') ? setData(matches) : loadCustomerData();
  
  }

  const handleSort = async(e)=> {
   let value=e.target.value;
   setSortValue(value)

    await axios
    .get(`http://localhost:5000/customers?_sort=${value}&_order=asc`).then((response) => setData(response.data)).catch((err) => console.log(err))
    setLoading(false)
    
  
  }

  const handlImageClick = async(e)=> {
    console.log(e)

     setImagePath(e)
     setDisplayImage(!displayImage)
  
  }


  console.log('data',data)
  return (
    <div className="App">
     <h2>Data Table With Search</h2>
     <input className='search' type='text' onChange={(e) => handleSearch(e.target.value)} value={value} placeholder='Search..' />
     <br/>
     <label for="sort" >Sort by</label>
    <select id='sort' value={sortValue}
    
    onChange={handleSort}
    >
      {
       sortOptions.map(
         (item,index)=>
        <option key={index} value={item}>{item}</option>

       )
      }

    </select>
     <table>
  <tr>
    <th>ID</th>
    <th>Picture</th>
    <th>Full Name</th>
    <th>Username</th>
    <th>Email</th>
    <th>Action</th>


  </tr>
  {data.map(

    (item , index)=> (

      <tr key={index}>
      <td>{item.ID}</td>
      <td><img src={item.picture} onClick={(e) => handlImageClick(item.picture)} className='avatar' />

     <div className={(displayImage) ? 'show' : 'hide'} >  <Lightbox onClose={(e) => handlImageClick(item.picture)}  image={imagePath} title="Image Title"></Lightbox></div>
    
     
      
      </td>
      <td>{item.full_name}</td>
      <td>{item.username}</td>
      <td>{item.email}</td>
      <td>
     
  <Popup trigger={<button> View Details</button>} position="left center">
    <div>
      
        <img src={item.picture} onClick={(e) => handlImageClick(item.picture)} className='avatar-detal' /> <br/>
        ID : {item.ID} <br/>
       Full Name : {item.full_name} <br/>
       Username : {item.username} <br/>
       Email : {item.email} <br/>
       Gender : {item.gender} <br/>
       Phone : {item.phone} <br/>
    </div>
  </Popup>

      
      </td>
     
    </tr>

    )
  )
 }
  
  
</table>
<Pagination
        itemPerPage={itemPerPage}
        totalItems={data.length}
        paginate={paginate}
      />
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const {products, search, showSearch, getProductsData, totalPages, currentPage, setCurrentPage} = useContext(ShopContext);
  const[showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] =  useState([]);
  const [category, setCategory] = useState([]);
  const [ subCategory, setSubCategory] = useState([]);
  const [sortType , setSortType] = useState('relavent')

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      getProductsData(newPage);
      window.scrollTo(0, 0);
    }
  }

  const toogleCategory = (e) =>{

    if(category.includes(e.target.value)){
      setCategory(prev=> prev.filter(item=> item !== e.target.value))

    }
    else{
      setCategory(prev => [...prev, e.target.value])
    }
  }


  const toogleSubCategory = (e) =>{
    if(subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item=> item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

const applyFilter = () =>{

  // if (!Array.isArray(products)) return;

  let productsCopy = products.slice();

  if(showSearch && search){
    productsCopy = productsCopy.filter(item=> item.name.toLowerCase().includes(search.toLowerCase()))
  }

  if(category.length >0 ){
    productsCopy = productsCopy.filter(item => category.includes(item.category));
  }
  if(subCategory.length>0){
    productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));

  }

  setFilterProducts(productsCopy)

}

  const sortProduct = () =>{

    let fpCopy = filterProducts.slice();

    switch(sortType){
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b) =>(a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
          break;
       default:
        applyFilter();
        break;   

    }

  }
  
  useEffect (() =>{
    applyFilter();
  },[category,subCategory,search,showSearch,products])

  useEffect(()=>{
    sortProduct();
  },[sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* filteer options */}
      <div className='min-w-60'>
        <p  onClick = {()=>setShowFilter(!showFilter)}className='my-2  text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img  className = { `h-3 sm:hidden ${showFilter? 'rotate-90' : ''}`} src= {assets.dropdown_icon} alt=''/>
        </p>
        {/* category filter */}
        <div className={`filter-box mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Men'} onClick={toogleCategory}/>Men
            </p>
             <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Women'} onClick={toogleCategory}/>Women
            </p>
             <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Kids'} onClick={toogleCategory}/>Kids
            </p>
          </div>
        </div>
        {/* Subcategory  filter */}

         <div className={`filter-box my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Topwear'} onClick={toogleSubCategory}/>Topwear
            </p>
             <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Bottomwear'} onClick={toogleSubCategory}/>Bottomwear
            </p>
             <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Winterwear'} onClick={toogleSubCategory}/>Winterwear
            </p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <div className = 'flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'}/>
          {/* Product sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevent">Sort by:Relevent</option>
            <option value= " low-high">Sort by: Low to High</option>
             <option value="high-low">Sort by High to Low</option>
          </select>
        </div>
        {/* Map products */}
        <div className='product-grid'>
          {
            filterProducts.map((item, index)=>(
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image}/>
            ))
          }
        </div>

        {/* Pagination Controls */}
        <div className='flex justify-center items-center gap-2 mt-10 mb-10'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 border rounded ${
                currentPage === page
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
          >
            Next
          </button>
        </div>

      </div>
    </div>
  )
}

export default Collection

import { useEffect, useMemo, useState } from 'react'
import Layout from '../../../../components/admin/layout'
import styles from '../../../../styles/products.module.scss'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { useGetCategoriesQuery } from '../../../../store/services/dashboardService'
import SingularSelectProduct from '../../../../components/selects/SingularSelectProduct'
import AdminInput from '../../../../components/inputs/adminInput'
import Images from '../../../../components/admin/createProduct/images'

const initialState = {
  name: '',
  description: '',
  brand: '',
  sku: '',
  discount: 0,
  images: [],
  description_images: [],
  parent: '',
  category: '',
  subCategories: '',
  color: {
    color: '',
    image: '',
  },
  sizes: {
    size: '',
    qty: '',
    price: '',
  },
  details: [
    {
      name: '',
      value: '',
    },
  ],
  questions: [
    {
      name: '',
      value: '',
    },
  ],
  shippingFee: '',
}

export default function CreateProductScreen() {
  const [product, setProduct] = useState(initialState)
  const [colorImage, setColorImage] = useState('')
  const [images, setImages] = useState('')
  const [description_images, setDescription_images] = useState('')
  const [loading, setLoading] = useState(false)

  const { userSession } = useSelector((state) => state.authReducer)

  const { data: categoryData, refetch } = useGetCategoriesQuery({
    token: userSession.access_token,
  })

  const categories = useMemo(() => categoryData?.data || [], [categoryData])

  useEffect(() => {
    refetch()
  }, [refetch])

  const validate = Yup.object({
    name: Yup.string()
      .required('Please add a name')
      .min(5, 'Product name must between 5 and 50 characters.')
      .max(50, 'Product name must between 10 and 50 characters.'),
    brand: Yup.string().required('Please add a brand'),
    category: Yup.string().required('Please select a category'),
    sku: Yup.string().required('Please add a sku'),
    color: Yup.string().required('Please add a color'),
    description: Yup.string().required('Please add a description'),
  })
  const createProduct = async () => {}
  const handleChange = (e) => {
    const { value, name } = e.target
    setProduct({ ...product, [name]: value })
  }
  return (
    <>
      <Layout>
        <div className={styles.header}>Create Product</div>
        <Formik
          enableReinitialize
          initialValues={{
            name: product.name,
            brand: product.name,
            description: product.description,
            category: product.category,
            subCategories: product.subCategories,
            parent: product.parent,
            sku: product.sku,
            discount: product.discount,
            color: product.color.color,
            imageInputFile: '',
            styleInput: '',
          }}
          validationSchema={validate}
          onSubmit={() => {
            createProduct()
          }}>
          {() => (
            <Form>
              <Images
                name="imageInputFile"
                header="Product Carousel Images"
                text="Add images"
                images={images}
                setImages={setImages}
                setColorImage={setColorImage}
              />
              <div className={styles.flex}>
                {product.color.image && (
                  <img
                    src={product.color.image}
                    className={styles.image_span}
                    alt=""
                  />
                )}
                {product.color.color && (
                  <span
                    className={styles.color_span}
                    style={{ background: `${product.color.color}` }}></span>
                )}
              </div>
              {/* {
                <Colors
                  name="color"
                  product={product}
                  setProduct={setProduct}
                  colorImage={colorImage}
                />
                <Style name="styleInput"
                product={product}
                setProduct={setProduct}
                colorImage={colorImage}
                />
              } */}
              {/* <SingularSelectProduct
                key={parents._id}
                name="parent"
                value={product.parent}
                placeholder="Parent product"
                data={parents}
                header="Add to an existing product"
                handleChange={handleChange}
              /> */}
              <SingularSelectProduct
                name="category"
                value={product.category}
                // label="Category"
                placeholder="Category"
                data={categories}
                header="Select a Category"
                handleChange={handleChange}
              />
              <div className={styles.heading}>Basic Information</div>
              <AdminInput
                type="text"
                label="Name"
                name="name"
                placeholder="Product Name"
                onChange={handleChange}
              />
              <AdminInput
                type="text"
                label="Description"
                name="description"
                placeholder="Product Description"
                onChange={handleChange}
              />
              <AdminInput
                type="text"
                label="Brand"
                name="brand"
                placeholder="Product Brand"
                onChange={handleChange}
              />
              <AdminInput
                type="text"
                label="SKU"
                name="sku"
                placeholder="Product SKU"
                onChange={handleChange}
              />
              <AdminInput
                type="text"
                label="Discount"
                name="discount"
                placeholder="Product discount"
                onChange={handleChange}
              />
              {/* <Images
              name="imageDescInputFile"
              header="Product Description Images"
              text="Add images"
              images={description_images}
              setImages={setDescriptionImages}
              setColorImage={setColorImage}
            /> */}
              {/* <Sizes
              sizes={product.sizes}
              product={product}
              setProduct={setProduct}
            /> */}
              {/* <Details
              sizes={product.details}
              product={product}
              setProduct={setProduct}
            /> */}
              {/* <Questions
              sizes={product.questions}
              product={product}
              setProduct={setProduct}
            /> */}
              <div className={styles.btnWrap}>
                <button type="submit" className={styles.btnn}>
                  <span>Create Product</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Layout>
    </>
  )
}

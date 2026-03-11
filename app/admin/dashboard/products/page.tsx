'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/types'
import { CONFIG } from '@/lib/config'
import { categories } from '@/app/components/constants'

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    stock: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      const result = await response.json()

      if (result.success) {
        setProducts(result.data)
      } else {
        setError('Error al cargar productos')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres'
    }
    if (!formData.description || formData.description.length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres'
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'El precio debe ser mayor a 0'
    }
    if (!formData.category) {
      errors.category = 'Debes seleccionar una categoría'
    }
    if (!formData.image_url || !formData.image_url.startsWith('http')) {
      errors.image_url = 'Debes proporcionar una URL válida'
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = 'El stock debe ser un número no negativo'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      const url = editingId ? `/api/products/${editingId}` : '/api/products'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          image_url: formData.image_url,
          stock: parseInt(formData.stock),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Error al guardar el producto')
        return
      }

      // Reset form and refresh
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: '',
        stock: '',
      })
      setEditingId(null)
      setShowForm(false)
      setFormErrors({})
      await fetchProducts()
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url,
      stock: product.stock.toString(),
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      
      if (response.ok) {
        await fetchProducts()
      } else {
        setError('Error al eliminar el producto')
      }
    } catch (err) {
      setError('Error de conexión')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      stock: '',
    })
    setFormErrors({})
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Gestionar Productos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            background: CONFIG.PRIMARY_COLOR,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
        }}>
          {error}
        </div>
      )}

      {/* Product Form */}
      {showForm && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px',
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>
            {editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              {/* Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                  fontSize: '14px',
                }}>
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Limpiador Multiusos"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: formErrors.name ? '2px solid #c33' : '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                {formErrors.name && (
                  <p style={{ color: '#c33', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                  fontSize: '14px',
                }}>
                  Precio *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="299.99"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: formErrors.price ? '2px solid #c33' : '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                {formErrors.price && (
                  <p style={{ color: '#c33', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {formErrors.price}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                  fontSize: '14px',
                }}>
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: formErrors.category ? '2px solid #c33' : '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p style={{ color: '#c33', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {formErrors.category}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#333',
                  fontWeight: '500',
                  fontSize: '14px',
                }}>
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="50"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: formErrors.stock ? '2px solid #c33' : '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                {formErrors.stock && (
                  <p style={{ color: '#c33', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {formErrors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '14px',
              }}>
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el producto en detalle..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: formErrors.description ? '2px solid #c33' : '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
              {formErrors.description && (
                <p style={{ color: '#c33', fontSize: '12px', margin: '5px 0 0 0' }}>
                  {formErrors.description}
                </p>
              )}
            </div>

            {/* Image URL */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '14px',
              }}>
                URL de la Imagen *
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: formErrors.image_url ? '2px solid #c33' : '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
              {formErrors.image_url && (
                <p style={{ color: '#c33', fontSize: '12px', margin: '5px 0 0 0' }}>
                  {formErrors.image_url}
                </p>
              )}
              {formData.image_url.startsWith('http') && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    style={{
                      maxWidth: '150px',
                      maxHeight: '150px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                    }}
                    onError={() => console.log('Error loading image')}
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: loading ? '#ccc' : CONFIG.PRIMARY_COLOR,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        {loading && !showForm ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Cargando productos...
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            No hay productos aún. Crea el primero!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}>
              <thead>
                <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Nombre</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Categoría</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Precio</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Stock</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#333' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', color: '#333' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '4px',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', color: '#666' }}>{product.category}</td>
                    <td style={{ padding: '15px', color: '#333', fontWeight: '600' }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td style={{
                      padding: '15px',
                      color: product.stock > 0 ? '#27ae60' : '#e74c3c',
                      fontWeight: '600',
                    }}>
                      {product.stock}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(product)}
                        style={{
                          padding: '6px 12px',
                          background: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginRight: '8px',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

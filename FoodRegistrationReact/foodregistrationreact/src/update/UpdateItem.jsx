import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const API_URL = 'http://localhost:5244';

const UpdateItem = () => {
  const { id } = useParams(); // Get the item ID from the route
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    certificate: '',
    imageUrl: '',
    energy: '',
    carbohydrates: '',
    sugar: '',
    protein: '',
    fat: '',
    saturatedfat: '',
    unsaturatedfat: '',
    fibre: '',
    salt: '',
    countryOfOrigin: '',
    countryOfProvenance: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submissionError, setSubmissionError] = useState(null);

  // Fetch the item's current data
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_URL}/api/itemapi/items/${id}`);
        if (!response.ok) throw new Error('Failed to fetch item data.');

        const data = await response.json();
        setFormData(data);
      } catch (error) {
        setSubmissionError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.category) newErrors.category = 'Category is required.';
    if (formData.category.length > 50) newErrors.category = 'Category cannot exceed 50 characters.';
    if (formData.certificate && formData.certificate.length > 50) newErrors.certificate = 'Certificate cannot exceed 50 characters.';
    if (!formData.energy || formData.energy < 0) newErrors.energy = 'Energy must be a non-negative number.';
    if (!formData.carbohydrates || formData.carbohydrates < 0) newErrors.carbohydrates = 'Carbohydrates must be a non-negative number.';
    if (!formData.sugar || formData.sugar < 0) newErrors.sugar = 'Sugar must be a non-negative number.';
    if (!formData.protein || formData.protein < 0) newErrors.protein = 'Protein must be a non-negative number.';
    if (!formData.fat || formData.fat < 0) newErrors.fat = 'Fat must be a non-negative number.';
    if (!formData.saturatedfat || formData.saturatedfat < 0) newErrors.saturatedfat = 'Saturated fat must be a non-negative number.';
    if (!formData.unsaturatedfat || formData.unsaturatedfat < 0) newErrors.unsaturatedfat = 'Unsaturated fat must be a non-negative number.';
    if (!formData.fibre || formData.fibre < 0) newErrors.fibre = 'Fibre must be a non-negative number.';
    if (!formData.salt || formData.salt < 0) newErrors.salt = 'Salt must be a non-negative number.';
    if (!formData.countryOfOrigin) newErrors.countryOfOrigin = 'Country of origin is required.';
    if (!formData.countryOfProvenance) newErrors.countryOfProvenance = 'Country of provenance is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm()) return;

    try {
      const response = await fetch(`${API_URL}/api/itemapi/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update item.');

      navigate('/'); // Redirect to home on success
    } catch (err) {
      setSubmissionError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (submissionError) return <Alert variant="danger">{submissionError}</Alert>;

  return (
    <div className="container mt-4">
      <h1>Update Item</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            isInvalid={!!errors.category}
          />
          <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Certificate</Form.Label>
          <Form.Control
            type="text"
            name="certificate"
            value={formData.certificate}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </Form.Group>

        {['energy', 'carbohydrates', 'sugar', 'protein', 'fat', 'saturatedfat', 'unsaturatedfat', 'fibre', 'salt'].map((field) => (
          <Form.Group className="mb-3" key={field}>
            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
            <Form.Control
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              isInvalid={!!errors[field]}
            />
            <Form.Control.Feedback type="invalid">{errors[field]}</Form.Control.Feedback>
          </Form.Group>
        ))}

        <Form.Group className="mb-3">
          <Form.Label>Country of Origin</Form.Label>
          <Form.Control
            type="text"
            name="countryOfOrigin"
            value={formData.countryOfOrigin}
            onChange={handleChange}
            isInvalid={!!errors.countryOfOrigin}
          />
          <Form.Control.Feedback type="invalid">{errors.countryOfOrigin}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Country of Provenance</Form.Label>
          <Form.Control
            type="text"
            name="countryOfProvenance"
            value={formData.countryOfProvenance}
            onChange={handleChange}
            isInvalid={!!errors.countryOfProvenance}
          />
          <Form.Control.Feedback type="invalid">{errors.countryOfProvenance}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Item
        </Button>
      </Form>
    </div>
  );
};

export default UpdateItem;

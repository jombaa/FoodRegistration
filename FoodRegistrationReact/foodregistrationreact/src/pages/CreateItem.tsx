import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Item } from '../types/item';
import { createItem } from '../api/apiService';
import { useAuth } from '../components/AuthContext'; // Import AuthContext for token and logout
import '../styles/site.css'; // Ensure the correct path to your CSS

const CreateItem: React.FC = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth(); // Get the token and logout function
  const [formData, setFormData] = useState<Item>({
    itemId: 0, // This will be ignored on the backend
    name: '',
    category: '',
    certificate: '',
    imageUrl: '',
    energy: undefined,
    carbohydrates: undefined,
    sugar: undefined,
    protein: undefined,
    fat: undefined,
    saturatedfat: undefined,
    unsaturatedfat: undefined,
    fibre: undefined,
    salt: undefined,
    countryOfOrigin: '',
    countryOfProvenance: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || undefined : value,
    }));
  };

  // Validate the form data
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.category) newErrors.category = 'Category is required.';
    if (!formData.countryOfOrigin)
      newErrors.countryOfOrigin = 'Country of origin is required.';
    if (!formData.countryOfProvenance)
      newErrors.countryOfProvenance = 'Country of provenance is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm()) return;

    // Check if the token exists
    if (!token) {
      setSubmissionError('User is not authenticated. Please log in.');
      return;
    }

    setIsSubmitting(true); // Start submission loading state
    try {
      await createItem(formData, token); // Pass the token to createItem

      alert('Item created successfully!');
      navigate('/'); // Redirect to home page
    } catch (error: any) {
      console.error('Creation error:', error);
      if (
        error.message === 'Unauthorized' ||
        error.message === 'Invalid token.' ||
        error.message === 'User is not authenticated. Please log in.'
      ) {
        // Token might be invalid or expired
        logout(); // Clear authentication state
        navigate('/login'); // Redirect to login page
      } else {
        setSubmissionError(`Failed to create the item: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false); // End submission loading state
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="card p-4 shadow" style={{ width: '600px' }}>
        <h1 className="text-center mb-4">Create New Item</h1>
        {submissionError && <Alert variant="danger">{submissionError}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* Name Field */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Category Field */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              isInvalid={!!errors.category}
            />
            <Form.Control.Feedback type="invalid">
              {errors.category}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Certificate Field */}
          <Form.Group className="mb-3">
            <Form.Label>Certificate</Form.Label>
            <Form.Control
              type="text"
              name="certificate"
              value={formData.certificate || ''}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Image URL Field */}
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Nutritional Fields */}
          {[
            'energy',
            'carbohydrates',
            'sugar',
            'protein',
            'fat',
            'saturatedfat',
            'unsaturatedfat',
            'fibre',
            'salt',
          ].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Form.Label>
              <Form.Control
                type="text"
                name={field}
                value={formData[field as keyof Item] ?? ''}
                onChange={handleChange}
              />
            </Form.Group>
          ))}

          {/* Country of Origin Field */}
          <Form.Group className="mb-3">
            <Form.Label>Country of Origin</Form.Label>
            <Form.Control
              type="text"
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              isInvalid={!!errors.countryOfOrigin}
            />
            <Form.Control.Feedback type="invalid">
              {errors.countryOfOrigin}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Country of Provenance Field */}
          <Form.Group className="mb-3">
            <Form.Label>Country of Provenance</Form.Label>
            <Form.Control
              type="text"
              name="countryOfProvenance"
              value={formData.countryOfProvenance}
              onChange={handleChange}
              isInvalid={!!errors.countryOfProvenance}
            />
            <Form.Control.Feedback type="invalid">
              {errors.countryOfProvenance}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Submit and Cancel Buttons */}
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="create-button"
              style={{ width: '130px', height: '40px' }}
            >
              {isSubmitting ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                'Create Item'
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              style={{ width: '130px', height: '40px' }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateItem;

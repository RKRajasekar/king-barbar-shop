import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCut as ServiceIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const categories = ['Haircut', 'Fade', 'Beard', 'Spa & Care', 'Combos'];

const AdminServices = () => {
  const { showSuccess, showError } = useNotification();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Haircut');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/services?includeInactive=true');
      if (response.data.success) {
        setServices(response.data.services);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      showError('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentServiceId(null);
    setName('');
    setCategory('Haircut');
    setDescription('');
    setPrice('');
    setDuration('30');
    setImage('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80');
    setIsActive(true);
    setDialogOpen(true);
  };

  const handleOpenEdit = (service) => {
    setIsEditing(true);
    setCurrentServiceId(service.id);
    setName(service.name);
    setCategory(service.category);
    setDescription(service.description);
    setPrice(service.price);
    setDuration(service.duration);
    setImage(service.image || '');
    setIsActive(service.isActive);
    setDialogOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      category,
      description,
      price: parseFloat(price),
      duration: parseInt(duration),
      image,
      isActive,
    };

    try {
      if (isEditing) {
        const response = await api.put(`/services/${currentServiceId}`, payload);
        if (response.data.success) {
          showSuccess('Service updated successfully!');
        }
      } else {
        const response = await api.post('/services', payload);
        if (response.data.success) {
          showSuccess('Service added successfully!');
        }
      }
      setDialogOpen(false);
      fetchServices();
    } catch (err) {
      showError(err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      const response = await api.put(`/services/${service.id}`, {
        isActive: !service.isActive,
      });
      if (response.data.success) {
        showSuccess(`Service ${!service.isActive ? 'activated' : 'deactivated'}.`);
        fetchServices();
      }
    } catch (err) {
      showError(err.message || 'Failed to update service status.');
    }
  };

  const handleOpenDelete = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/services/${serviceToDelete.id}`);
      if (response.data.success) {
        showSuccess(response.data.message || 'Service deleted successfully.');
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
        fetchServices();
      }
    } catch (err) {
      showError(err.message || 'Failed to delete service.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A1A1A' }}>
            Barber Services Catalog
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Create, edit, change prices, and enable/disable services.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ borderRadius: 2.5, fontWeight: 700, px: 3 }}
        >
          Add New Service
        </Button>
      </Box>

      {/* Services Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          bgcolor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.06)',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#FF6B00' }} />
          </Box>
        ) : services.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ServiceIcon sx={{ fontSize: 48, color: '#CCC', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No services found
            </Typography>
            <Button variant="contained" color="primary" onClick={handleOpenAdd} sx={{ mt: 2 }}>
              Add Your First Service
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>SERVICE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>CATEGORY</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>PRICE</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>DURATION</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#666' }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: '#666' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={service.image}
                          variant="rounded"
                          sx={{ width: 48, height: 48, borderRadius: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {service.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#777',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              maxWidth: 300,
                            }}
                          >
                            {service.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={service.category}
                        size="small"
                        sx={{ bgcolor: '#FFF1E6', color: '#FF6B00', fontWeight: 700 }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 900, color: '#1A1A1A', fontSize: '1rem' }}>
                      ₹{service.price}
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>
                      {service.duration} mins
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                          size="small"
                          checked={service.isActive}
                          onChange={() => handleToggleStatus(service)}
                          color="primary"
                        />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: service.isActive ? '#52C41A' : '#999' }}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit Service">
                          <IconButton size="small" onClick={() => handleOpenEdit(service)}>
                            <EditIcon fontSize="small" sx={{ color: '#1890FF' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Service">
                          <IconButton size="small" onClick={() => handleOpenDelete(service)}>
                            <DeleteIcon fontSize="small" sx={{ color: '#FF4D4F' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add / Edit Service Modal Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1.5 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {isEditing ? 'Edit Barber Service' : 'Add New Barber Service'}
          </Typography>
          <IconButton onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSaveService}>
          <DialogContent dividers>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Service Name"
                  placeholder="e.g. Skin Fade Special"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  placeholder="Describe the experience, products, and finish..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price (₹)"
                  placeholder="350"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (minutes)"
                  placeholder="45"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  helperText="Provide a high resolution image URL"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
              sx={{ px: 3, borderRadius: 2, fontWeight: 700 }}
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Service'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 800 }}>
          Delete Service?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>{serviceToDelete?.name}</strong>? If this service has active appointments, it will be automatically set to Inactive instead of deleting history.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={handleConfirmDelete}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminServices;

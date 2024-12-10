import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Backdrop,
    CircularProgress,
    Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useGetEmployeesQuery, useDeleteEmployeeMutation } from "../services/employeeApi";
import AddEditEmployeeModal from "./AddEditEmployeeModal";
import toast from "react-hot-toast";

const EmployeeTable: React.FC = () => {
    const { data: _employees = [], isLoading, refetch } = useGetEmployeesQuery();
    const [deleteEmployee] = useDeleteEmployeeMutation();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<any>(null);
    const [singleDeleteId, setSingleDeleteId] = useState<number | null>(null);

    const employees = _employees?.employees;

    console.log('EmployeeTable', { employees })

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedIds(employees.map((employee) => employee.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        try {
            if (singleDeleteId !== null) {
                await deleteEmployee(singleDeleteId).unwrap();
                toast.success('Employee deleted successfully')
            } else {
                await Promise.all(selectedIds.map((id) => deleteEmployee(id).unwrap()));
                toast.success('Employees deleted successfully')
            }
            setDeleteDialogOpen(false);
            setSingleDeleteId(null);
            setSelectedIds([]);
            refetch();
        } catch (error) {
            console.error("Failed to delete employee(s):", error);
            toast.error('Something went wrong');
        }
    };

    const openModal = (employee: any = null) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleSingleDelete = (employeeId: number) => {
        setSingleDeleteId(employeeId);
        setDeleteDialogOpen(true);
    }

    return (
        <div className="p-10">
            <div className="flex justify-between items-center mb-4">
                <Button variant="contained" color="primary" onClick={() => openModal()}>
                    Add New Employee
                </Button>
                {selectedIds.length > 0 && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        Delete Selected ({selectedIds.length})
                    </Button>
                )}
            </div>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={
                                        selectedIds.length > 0 &&
                                        selectedIds.length < employees.length
                                    }
                                    checked={selectedIds.length === (employees?.length)}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees && employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedIds.includes(employee.id)}
                                        onChange={() => handleSelectOne(employee.id)}
                                    />
                                </TableCell>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.position}</TableCell>
                                <TableCell>{employee.department}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => openModal(employee)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleSingleDelete(employee.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {
                            employees && employees.length == 0 && <TableRow>
                                <TableCell colSpan={5}>
                                    <Typography variant="h6" align="center" className="mt-4">
                                        No employees available.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        }
                        {
                            isLoading && <TableRow>
                                <TableCell colSpan={5}>

                                    <Backdrop
                                        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
                                        open={isLoading}
                                    >
                                        <CircularProgress color="inherit" />
                                    </Backdrop>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete Employees</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the selected employees? This
                        action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add New Employee or Update Employee Modal */}
            <AddEditEmployeeModal
                open={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                employee={editingEmployee}
                onRefresh={refetch}
            />
        </div>
    );
};

export default EmployeeTable;

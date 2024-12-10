import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from "@mui/material";
import {
    useAddEmployeeMutation,
    useUpdateEmployeeMutation,
} from "../services/employeeApi";
import toast from "react-hot-toast";

interface AddEditEmployeeModalProps {
    open: boolean;
    onClose: () => void;
    setIsModalOpen: (a: boolean) => void;
    employee: any;
    onRefresh: () => void;
}

const AddEditEmployeeModal: React.FC<AddEditEmployeeModalProps> = ({
    open,
    setIsModalOpen,
    employee,
    onRefresh,
}) => {
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [addEmployee] = useAddEmployeeMutation();
    const [updateEmployee] = useUpdateEmployeeMutation();

    useEffect(() => {
        if (employee) {
            setName(employee.name);
            setPosition(employee.position);
            setDepartment(employee.department);
        } else {
            setName("");
            setPosition("");
            setDepartment("");
        }
    }, [employee]);

    const handleSubmit = async () => {
        try {
            if (employee) {
                await updateEmployee({ id: employee.id, name, position, department }).unwrap();
                toast.success('Employee updated successfully');
            } else {
                await addEmployee({ name, position, department }).unwrap();
                toast.success('Employee added successfully');
            }
            onRefresh();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving employee:", error);
            toast.error('Failed to save employee. Please try again.');
        }
    };


    return (
        <Dialog open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    setIsModalOpen(false);
                }
            }}>
            <DialogTitle>{employee ? "Update Employee Details" : "Add New Employee"}</DialogTitle>
            <DialogContent className="space-y-4 !pt-2">
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEditEmployeeModal;

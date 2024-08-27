import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { getCategories } from "../api/categories";
import { createExpense } from "../api/expense";
import { useForm, Controller } from "react-hook-form"; // Import react-hook-form
import { yupResolver } from "@hookform/resolvers/yup"; // For validation
import * as yup from "yup"; // For validation schema
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

// Transition for the dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Define form values type
interface FormValues {
  amount: number;
  categoryId: string;
  date: any;
}

// Validation schema using Yup
const schema = yup.object().shape({
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  categoryId: yup.string().required("Category is required"),
  date: yup.mixed().required("Target date is required"),
});

const AddExpenseForm: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const [categories, setCategories] = useState<any[]>([]);

  // useForm hook from react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token")?.toString();
        const fetchedCategories = await getCategories(token as string);
        setCategories(fetchedCategories); // Set categories state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: FormValues) => {
    const token = localStorage.getItem("token")?.toString();
    const expenseData = {
      amount: data.amount,
      categoryId: data.categoryId,
      date: data.date,
      description: "Optional description here",
    };

    try {
      const newExpense = await createExpense(token as string, expenseData);
      console.log("Expense created successfully:", newExpense);
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Add Your Expense"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="amount"
                control={control}
                defaultValue={0.0}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={!!errors.amount}
                    helperText={errors.amount ? errors.amount.message : ""}
                  />
                )}
              />

              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
                fullWidth
                error={!!errors.categoryId}
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Controller
                  name="categoryId"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="category-label"
                      label="Category"
                      fullWidth
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {categories.map((category: any) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.categoryId && <p>{errors.categoryId.message}</p>}
              </FormControl>
              <Box mt={3}>
                <Controller
                  name="date"
                  control={control}
                  defaultValue={moment()} // Default to today's date using moment
                  render={({ field }) => (
                    <DatePicker {...field} label="Expense Date" />
                  )}
                />
              </Box>

              <Button
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </LocalizationProvider>
    </React.Fragment>
  );
};

export default AddExpenseForm;

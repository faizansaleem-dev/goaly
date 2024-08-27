import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import { TransitionProps } from "@mui/material/transitions";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { createGoal } from "../api/goal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";

// Define Transition for the dialog
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
  target_amount: number;
  current_amount?: number | null;
  target_date: any; // Use moment.Moment instead of Date
}

// Validation schema using Yup
const schema = yup.object().shape({
  target_amount: yup
    .number()
    .required("Target amount is required")
    .positive("Target amount must be positive"),
  current_amount: yup
    .number()
    .positive("Current amount must be positive")
    .nullable(),
  target_date: yup
    .mixed()
    .required("Target date is required")
    .test("is-future-date", "Target date must be in the future", (value) =>
      value ? moment(value).isAfter(moment()) : false
    ),
});

const AddGoalForm: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const token = localStorage.getItem("token")?.toString();
    await createGoal(token as string, data);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Add Your Goal"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="target_amount"
              control={control}
              defaultValue={0.0}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Target Amount"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.target_amount}
                  helperText={
                    errors.target_amount ? errors.target_amount.message : ""
                  }
                />
              )}
            />
            <Controller
              name="current_amount"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Current Amount"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.current_amount}
                  helperText={
                    errors.current_amount ? errors.current_amount.message : ""
                  }
                />
              )}
            />
            <Controller
              name="target_date"
              control={control}
              defaultValue={moment()} // Default to today's date using moment
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Target Date"
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Goal
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddGoalForm;

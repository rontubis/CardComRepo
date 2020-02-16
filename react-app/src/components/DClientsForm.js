import React, { useState, useEffect } from "react";
import { Grid, TextField, withStyles, FormControl, InputLabel, Select, MenuItem, Button, FormHelperText } from "@material-ui/core";
import useForm from "./useForm";
import { connect } from "react-redux";
import * as actions from "../actions/dClient";
import { useToasts } from "react-toast-notifications";

const styles = theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            minWidth: 230,
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 230,
    },
    smMargin: {
        margin: theme.spacing(1)
    }
})

const initialFieldValues = {
    fullName: '',
    mobile: '',
    email: '',
    tz: '',
    gender: '',
    birthDate: ''
}

const DClientForm = ({ classes, ...props }) => {

    //toast msg.
    const { addToast } = useToasts()

   
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('fullName' in fieldValues)
        temp.fullName = fieldValues.fullName ? "" : "This field is required."
        if ('tz' in fieldValues)
            temp.tz =  (/^[0-9]*$/).test(fieldValues.tz) ? ( fieldValues.tz ? "" : "This field is required.") : "Allow only numbers."
        if ('birthDate' in fieldValues)
            temp.birthDate = fieldValues.birthDate == "mm/dd/yyyy" ||  fieldValues.birthDate =="" ? "This field is required." : ""
        if ('email' in fieldValues)
            temp.email = (/^$|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
        if ('mobile' in fieldValues)
            temp.mobile =  (/^[0-9]*$/).test(fieldValues.mobile) ? "" : "Allow only numbers."
       
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues, validate, props.setCurrentId)

    //material-ui select
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            const onSuccess = () => {
                resetForm()
                addToast("Submitted successfully", { appearance: 'success' })
            }
            if (props.currentId == 0)
                props.createDClient(values, onSuccess)
            else
                props.updateDClient(props.currentId, values, onSuccess)
        }
    }

    useEffect(() => {
        if (props.currentId != 0) {
            setValues({
                ...props.dClientList.find(x => x.id == props.currentId)
            })
            setErrors({})
        }
    }, [props.currentId])

    return (
        <form autoComplete="off" noValidate className={classes.root} onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={5}>
                    <TextField
                        name="fullName"
                        variant="outlined"
                        label="Full Name"
                        value={values.fullName}
                        onChange={handleInputChange}
                        {...(errors.fullName && { error: true, helperText: errors.fullName })}
                    />

                    <TextField
                        name="email"
                        variant="outlined"
                        label="Email"
                        value={values.email}
                        inputProps={{
                            maxLength: 80,
                          }} 
                        onChange={handleInputChange}
                        {...(errors.email && { error: true, helperText: errors.email })}
                    />
                    <FormControl variant="outlined"
                        className={classes.formControl}
                        {...(errors.gender && { error: true })}
                    >
                        <InputLabel ref={inputLabel}>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={values.gender == "0" ? "" : values.gender}
                            onChange={handleInputChange}
                            labelWidth={labelWidth}
                        >
                            <MenuItem value="">Select Gender</MenuItem>
                            <MenuItem value="1">Male</MenuItem>
                            <MenuItem value="2">Female</MenuItem>
                            <MenuItem value="3">Other</MenuItem>
                        </Select>
                        {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item xs={5}>

                    <TextField
                        name="mobile"
                        variant="outlined"
                        label="Mobile"
                        value={values.mobile}
                        onChange={handleInputChange}
                        {...(errors.mobile && { error: true, helperText: errors.mobile })}
                    />
                    <TextField
                        name="tz"
                        variant="outlined"
                        label="ID Number"
                        value={values.tz}
                        inputProps={{
                            maxLength: 9,
                          }} 
                        onChange={handleInputChange}
                        {...(errors.tz && { error: true, helperText: errors.tz })}
                    />
                    
                    <TextField
                        name="birthDate"
                        variant="outlined"
                        label="Bitrh Date"
                        value={values.birthDate.substring(0,10)}
                        onChange={handleInputChange}
                        type="date"
                        defaultValue="1986-05-24"
                        className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        {...(errors.birthDate && { error: true, helperText: errors.birthDate })}
                    />
                    
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className={classes.smMargin}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            className={classes.smMargin}
                            onClick={resetForm}
                        >
                            Reset
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </form>
    );
}


const mapStateToProps = state => ({
    dClientList: state.dClient.list
})

const mapActionToProps = {
    createDClient: actions.create,
    updateDClient: actions.update
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DClientForm));
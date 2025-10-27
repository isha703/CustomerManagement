import React, { Key } from "react";
import { X } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export interface Customer {
  
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: Customer;
  onSubmit: (values: Customer) => void;
  title: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
});

const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSubmit,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative p-8 border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-blue-800 text-center">{title}</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values);
            resetForm();
          }}
        >
          <Form className="space-y-4">
            {["firstName", "lastName", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <Field
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                />
                <ErrorMessage
                  name={field}
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              {title}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CustomerModal;

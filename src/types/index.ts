export type ProductType = {
  name: string;
  price: number;
};

export type StatusType =
  | "Rejected"
  | "Pending"
  | "Approved"
  | "In Progress"
  | "Completed"
  | "On Hold"
  | "Cancelled"
  | "Failed"
  | "Success"
  | "Error";

export interface UserType {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  status: StatusType;
}

export interface CurrUserType extends UserType {
  token: string;
}

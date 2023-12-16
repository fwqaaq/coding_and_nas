package main

import (
	protobuf_go "grpc_example/pb/protobuf.go"
	"time"

	"google.golang.org/protobuf/types/known/timestamppb"
)

var employees = []*protobuf_go.Employee{
	{
		Id:        1,
		No:        1994,
		FirstName: "John",
		LastName:  "Doe",
		MonthSalary: &protobuf_go.MonthSalary{
			Basic: 5000,
			Bonus: 125.5,
		},
		Status: protobuf_go.EmployeeStatus_NORMAL,
		LastModified: &timestamppb.Timestamp{
			Seconds: time.Now().Unix(),
		},
	},
	{
		Id:        2,
		No:        1995,
		FirstName: "Rachel",
		LastName:  "Green",
		MonthSalary: &protobuf_go.MonthSalary{
			Basic: 6000,
			Bonus: 150.5,
		},
		Status: protobuf_go.EmployeeStatus_ON_VACATION,
		LastModified: &timestamppb.Timestamp{
			Seconds: time.Now().Unix(),
		},
	},
}

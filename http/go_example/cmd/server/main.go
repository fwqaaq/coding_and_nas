package main

import (
	"errors"
	"fmt"
	protobuf_go "grpc_example/pb/protobuf.go"
	"io"
	"log"
	"net"
	"time"

	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/metadata"
)

const post = ":5001"

func main() {
	listen, err := net.Listen("tcp", post)
	if err != nil {
		log.Fatalln(err.Error())
	}
	creds, err := credentials.NewServerTLSFromFile("cert.pem", "private.pem")
	if err != nil {
		log.Fatalln(err.Error())
	}
	options := []grpc.ServerOption{grpc.Creds(creds)}
	server := grpc.NewServer(options...)
	protobuf_go.RegisterEmployeeServiceServer(server, new(employeeService))
	log.Println("Server is running on port", post)
	server.Serve(listen)
}

type employeeService struct {
	protobuf_go.UnimplementedEmployeeServiceServer
}

func (s *employeeService) GetByNo(ctx context.Context, req *protobuf_go.GetByNoRequest) (*protobuf_go.EmployeeResponse, error) {
	for i := range employees {
		if employees[i].No == req.No {
			emp := &protobuf_go.Employee{
				No:           employees[i].No,
				FirstName:    employees[i].FirstName,
				LastName:     employees[i].LastName,
				MonthSalary:  employees[i].MonthSalary,
				Status:       employees[i].Status,
				LastModified: employees[i].LastModified,
			}
			return &protobuf_go.EmployeeResponse{
				Employee: emp,
			}, nil
		}
	}
	return nil, errors.New("employee not found")
}

func (s *employeeService) GetAll(req *protobuf_go.GetAllRequest, stream protobuf_go.EmployeeService_GetAllServer) error {
	for _, e := range employees {
		if err := stream.Send(&protobuf_go.EmployeeResponse{Employee: e}); err != nil {
			return err
		}
		time.Sleep(2 * time.Second)
	}

	return nil
}

func (s *employeeService) AddPhoto(stream protobuf_go.EmployeeService_AddPhotoServer) error {
	md, ok := metadata.FromIncomingContext(stream.Context())
	if ok {
		fmt.Println("Employee No:", md["no"][0])
	}
	img := []byte{}
	for {
		data, err := stream.Recv()
		if err == io.EOF {
			fmt.Printf("File Size: %d\n", len(img))
			return stream.SendAndClose(&protobuf_go.AddPhotoResponse{IsOk: true})
		}
		if err != nil {
			return err
		}
		fmt.Printf("File received: %d\n", len(data.Data))
		img = append(img, data.Data...)
	}
}

func (s *employeeService) Save(context.Context, *protobuf_go.EmployeeRequest) (*protobuf_go.EmployeeResponse, error) {
	return nil, nil
}

func (s *employeeService) SaveAll(stream protobuf_go.EmployeeService_SaveAllServer) error {
	for {
		req, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}
		employees = append(employees, req.Employee)
		stream.Send(&protobuf_go.EmployeeResponse{Employee: req.Employee})
	}

	for _, emp := range employees {
		fmt.Println(emp)
	}

	return nil
}

func (s *employeeService) CreateToken(context.Context, *protobuf_go.TokenRequest) (*protobuf_go.TokenResponse, error) {
	return nil, nil
}

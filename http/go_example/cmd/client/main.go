package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"time"

	protobuf_go "grpc_example/pb/protobuf.go"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/types/known/timestamppb"
)

const port = ":5001"

func main() {
	creds, err := credentials.NewClientTLSFromFile("cert.pem", "")
	if err != nil {
		log.Fatal(err.Error())
	}
	options := []grpc.DialOption{grpc.WithTransportCredentials(creds)}
	conn, err := grpc.Dial("localhost"+port, options...)
	if err != nil {
		log.Fatal(err.Error())
	}
	defer conn.Close()
	client := protobuf_go.NewEmployeeServiceClient(conn)
	getByNo(client)
	// getAll(client)
	// addPhoto(client)
	// saveAll(client)
}

func saveAll(client protobuf_go.EmployeeServiceClient) {
	employees := []protobuf_go.Employee{
		{
			Id:        1,
			No:        1990,
			FirstName: "Walter",
			LastName:  "Daniel",
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
			FirstName: "Smith",
			LastName:  "Kobe",
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

	stream, err := client.SaveAll(context.Background())
	if err != nil {
		log.Fatal(err.Error())
	}
	finishChannel := make(chan struct{})
	go func() {
		for {
			res, err := stream.Recv()
			if err == io.EOF {
				finishChannel <- struct{}{}
				break
			}
			if err != nil {
				log.Fatal(err.Error())
			}
			fmt.Println(res.Employee)
		}
	}()
	for _, e := range employees {
		err := stream.Send(&protobuf_go.EmployeeRequest{Employee: &e})
		if err != nil {
			log.Fatal(err.Error())
		}
	}
	stream.CloseSend()
	<-finishChannel
}

func addPhoto(client protobuf_go.EmployeeServiceClient) {
	imgFile, err := os.Open("/Users/feiwu/Downloads/10_Sunshine_8k.jpg")
	if err != nil {
		log.Fatal(err.Error())
	}
	defer imgFile.Close()
	md := metadata.New(map[string]string{"no": "1995"})
	context := context.Background()
	context = metadata.NewOutgoingContext(context, md)
	stream, err := client.AddPhoto(context)
	if err != nil {
		log.Fatal(err.Error())
	}

	for {
		chunk := make([]byte, 128*1024)
		chunkSize, err := imgFile.Read(chunk)
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err.Error())
		}
		if chunkSize < len(chunk) {
			chunk = chunk[:chunkSize]
		}
		stream.Send(&protobuf_go.AddPhotoRequest{Data: chunk})
		time.Sleep(time.Millisecond * 500)
	}
	res, err := stream.CloseAndRecv()
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Println(res.IsOk)
}

func getByNo(client protobuf_go.EmployeeServiceClient) {
	res, err := client.GetByNo(context.Background(), &protobuf_go.GetByNoRequest{No: 1995})
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Println(res.Employee)
}

func getAll(client protobuf_go.EmployeeServiceClient) {
	stream, err := client.GetAll(context.Background(), &protobuf_go.GetAllRequest{})
	if err != nil {
		log.Fatal(err.Error())
	}
	for {
		res, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err.Error())
		}
		fmt.Println(res.Employee)
	}
}

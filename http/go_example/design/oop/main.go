package main

import "fmt"

type Person struct {
	name string
	age  int
	sex  string
}

type Student struct {
	Person
	school string
	grade  int
}

type IStudent interface {
	GetName() string
	SetName(name string)
}

func (s *Student) GetName() string {
	return s.Person.name
}

func (s *Student) SetName(name string) {
	s.Person.name = name
}

func CreateStudent(name string, age int, sex string) *Student {
	return &Student{
		Person: Person{
			name,
			age,
			sex,
		},
		school: "No.1 Middle School",
		grade:  6,
	}
}

func main() {
	s := CreateStudent("fwqaaq", 21, "male")
	s.SetName("feiwu")
	fmt.Println(s.GetName())
}

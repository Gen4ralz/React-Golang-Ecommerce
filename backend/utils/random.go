package utils

import (
	"fmt"
	"math/rand"
	"strings"
	"time"
)

const alphabet = "abcdefghijklmnopqrstuvwxyz"

func init() {
	rand.New(rand.NewSource(time.Now().Unix()))
}

func RandomInt(min, max int64) int64 {
	return min + rand.Int63n(max - min + 1)
}

func RandomString(n int) string {
	var sb strings.Builder

	k := len(alphabet)

	for i := 0; i < n; i++ {
		c := alphabet[rand.Intn(k)]
		sb.WriteByte(c)
	}
	return sb.String()
}

func RandomEmail() string {
	return fmt.Sprintf("%s@email.com", RandomString(5))
}

func RandomUser() string {
	return RandomString(5)
}

func RandomPassword() string {
	password := RandomString(6)
	hashedPassword, _ := HashPassword(password)
	return hashedPassword
}

func RandomRole() string {
	number := RandomInt(0, 1)
	if number == 0 {
		return fmt.Sprintln("admin")
	} else {
		return fmt.Sprintln("user")
	}
}
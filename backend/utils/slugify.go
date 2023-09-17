package utils

import (
	"regexp"
	"strings"
)

func Slugify(input string) string {
	// Create new temp variable
	var tmp string

	// Convert string to lowercase
	tmp = strings.ToLower(input)

	// Replace space with hyphens
	tmp = strings.ReplaceAll(tmp, " ", "-")

	// Remove non-alphanumeric characters and duplicate hyphens
	reg := regexp.MustCompile(`[^a-z0-9-']+`)
	tmp = reg.ReplaceAllString(tmp, "-")

	// Remove leading hypens
	tmp = strings.Trim(tmp, "-")

	return tmp
}
package utils

import "testing"

func TestSlugify(t *testing.T) {
	testCase := []struct {
		input string
		expect string
	}{
		{"Hello World", "hello-world"},
		{"Dai Yin Chan Mai!!", "dai-yin-chan-mai"},
		{"  Double Spaces  ", "double-spaces"},
		{"still's have single quote", "still's-have-single-quote"},
		{"CamelCaseText", "camelcasetext"},
		{"---Leading Hyphens","leading-hyphens"},
		{"!@#$%^&*()_+", ""},
	}

	for _, tc := range testCase {
		got := Slugify(tc.input)
		if got != tc.expect {
			t.Errorf("Slugify(%q) = %q, want %q", tc.input, got, tc.expect)
		}
	}
}
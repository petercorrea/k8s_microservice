# declaring variable types and assign default values
variable "do_token" {
  description = "DO API key"
  type        = string
}

variable "environment_name" {
  description = "environment name: staging or production"
  type        = string
}

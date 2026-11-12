terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Grupo de Segurança para a API de Acessibilidade
resource "aws_security_group" "api_sg" {
  name        = "accessibility-api-sg"
  description = "Liberar portas HTTP e SSH para a API de Acessibilidade"

  ingress {
    description = "HTTP Port"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "API App Port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Instância EC2 Ubuntu na AWS para hospedar a API
resource "aws_instance" "app_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS em us-east-1
  instance_type = "t2.micro"

  vpc_security_group_ids = [aws_security_group.api_sg.id]

  tags = {
    Name        = "Servidor-API-Acessibilidade"
    Environment = "Desenvolvimento"
  }
}
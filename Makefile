.DEFAULT_GOAL := help
target=dev


## —— 📦 Makefile 📦 —————————————————————————————————————————

help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' Makefile | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Proto —————————————————————————————————————————
protoGen: ## @proto Start all or <container_name> containers in foreground
    protoc --proto_path=src/protobuf --js_out=import_style=commonjs,binary:src/protobuf/gen --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./src/protobuf/gen src/protobuf/*.proto
# 	protoc 	src/protobuf/*.proto --go_out=src/protobuf/gen --go-grpc_out=src/protobuf/gen

## —— 🐋 Git 🐋 —————————————————————————————————————————
clearGit:
	git branch --merged | grep -v "master" >/tmp/merged-branches && vi /tmp/merged-branches && xargs git branch -d </tmp/merged-branches

confirm:
	@( read -p "$(RED)Are you sure? [y/N]$(RESET): " sure && case "$$sure" in [yY]) true;; *) false;; esac )


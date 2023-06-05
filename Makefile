.DEFAULT_GOAL := help
target=dev


## —— 📦 Makefile 📦 —————————————————————————————————————————

help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' Makefile | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Proto —————————————————————————————————————————
protoGen: ## @proto Start all or <container_name> containers in foreground
	protoc 	app/Adapter/In/ApiGrcp/proto/*.proto --go_out=app/Adapter/In/ApiGrcp/gen --go-grpc_out=app/Adapter/In/ApiGrcp/gen

## —— 🐋 Git 🐋 —————————————————————————————————————————
clearGit:
	git branch --merged | grep -v "master" >/tmp/merged-branches && vi /tmp/merged-branches && xargs git branch -d </tmp/merged-branches

confirm:
	@( read -p "$(RED)Are you sure? [y/N]$(RESET): " sure && case "$$sure" in [yY]) true;; *) false;; esac )


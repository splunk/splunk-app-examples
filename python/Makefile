# text reset
NO_COLOR=\033[0m
# yellow
ATTN_COLOR=\033[33;01m

.PHONY: run-all
run-all: ./*.py
	for file in $^; do printf "\n$(ATTN_COLOR)===== Running $${file} =====$(NO_COLOR)\n"; python $${file}; done

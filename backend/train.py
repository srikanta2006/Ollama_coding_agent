from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model
import torch

# --------------------------------------------------
# GPU CHECK
# --------------------------------------------------
print("=" * 50)
print("PyTorch Version:", torch.__version__)
print("CUDA Available:", torch.cuda.is_available())

if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
else:
    print("Training will run on CPU")
print("=" * 50)

# --------------------------------------------------
# MODEL
# --------------------------------------------------
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_name)

# TinyLlama doesn't have a pad token by default
tokenizer.pad_token = tokenizer.eos_token

print("Loading model...")
model = AutoModelForCausalLM.from_pretrained(model_name)

# --------------------------------------------------
# LORA CONFIG
# --------------------------------------------------
print("Applying LoRA...")

lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)

# Print trainable parameters
model.print_trainable_parameters()

# --------------------------------------------------
# DATASET
# --------------------------------------------------
print("Loading dataset...")

dataset = load_dataset(
    "json",
    data_files="expanded_dataset.jsonl"
)["train"]

print(f"Dataset Size: {len(dataset)} samples")


def tokenize(example):
    text = (
        f"Instruction: {example['instruction']}\n"
        f"Answer: {example['output']}"
    )

    tokens = tokenizer(
        text,
        truncation=True,
        padding="max_length",
        max_length=128
    )

    # Required for causal LM training
    tokens["labels"] = tokens["input_ids"].copy()

    return tokens


print("Tokenizing dataset...")
tokenized_dataset = dataset.map(
    tokenize,
    remove_columns=dataset.column_names
)

# --------------------------------------------------
# TRAINING ARGUMENTS
# --------------------------------------------------
training_args = TrainingArguments(
    output_dir="./tinyllama-coding-model",

    num_train_epochs=3,

    per_device_train_batch_size=2,

    gradient_accumulation_steps=2,

    learning_rate=2e-4,

    logging_steps=1,

    save_steps=20,

    save_total_limit=2,

    report_to="none",

    fp16=torch.cuda.is_available(),

    remove_unused_columns=False
)

# --------------------------------------------------
# DATA COLLATOR
# --------------------------------------------------
data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer,
    mlm=False
)

# --------------------------------------------------
# TRAINER
# --------------------------------------------------
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    data_collator=data_collator
)

# --------------------------------------------------
# TRAIN
# --------------------------------------------------
print("\nStarting Training...\n")

trainer.train()

# --------------------------------------------------
# SAVE MODEL
# --------------------------------------------------
print("\nSaving model...")

model.save_pretrained("./tinyllama-coding-model")
tokenizer.save_pretrained("./tinyllama-coding-model")

print("\nTraining Complete!")
print("Model saved to ./tinyllama-coding-model")
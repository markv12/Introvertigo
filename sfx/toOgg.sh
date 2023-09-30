#!/bin/bash

input_dir="./"
output_dir="./ogg"

echo "Converting .aif or .mp3 files to .ogg files, normalizing, and trimming silence..."

for file in "$input_dir"*.aif
do
    filename=$(basename "$file")
    filename="${filename%.*}"
    echo "Converting $filename to .ogg..."
    
    # amplify up to 0db and save as ogg
    sox "$file" -C 5 "$output_dir/$filename.ogg" gain -n -1
done

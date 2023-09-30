#!/bin/bash

input_dir="./"
output_dir="./ogg"

echo "Converting .aif or .mp3 files to .ogg files, normalizing, and trimming silence..."

for file in "$input_dir"*.aif
do
    filename=$(basename "$file")
    filename="${filename%.*}"
    echo "Converting $filename to .ogg..."
    
    ffmpeg -i "$file" -filter:a "loudnorm" -acodec libvorbis -aq 5 -y "$output_dir/$filename.ogg"
done

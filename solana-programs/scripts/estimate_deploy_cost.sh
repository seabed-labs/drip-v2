#!/bin/bash

program_size=$(wc -c < target/deploy/drip_v2.so)
#echo $program_size
program_size=$((program_size * 2))
#echo $program_size
rent=$(solana rent $program_size)
echo $rent

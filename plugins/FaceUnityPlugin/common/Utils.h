/*
* Copyright (c) 2019 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

#pragma once

#include <vector>
#include <memory>
#include <string>
#include <unordered_map>
#include <sstream>
#include <fstream>
#include <iostream>

namespace Utils
{
	size_t FileSize(std::ifstream& file);
	bool LoadBundle(const std::string& filepath, std::vector<char>& data);
}
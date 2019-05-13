/*
* Copyright (c) 2019 Agora.io
* All rights reserved.
* Proprietry and Confidential -- Agora.io
*/

#include "Utils.h"	

namespace Utils {

	size_t FileSize(std::ifstream& file)
	{
		std::streampos oldPos = file.tellg();
		file.seekg(0, std::ios::beg);
		std::streampos beg = file.tellg();
		file.seekg(0, std::ios::end);
		std::streampos end = file.tellg();
		file.seekg(oldPos, std::ios::beg);
		return static_cast<size_t>(end - beg);
	}

	bool LoadBundle(const std::string& filepath, std::vector<char>& data)
	{
		std::ifstream fin(filepath, std::ios::binary);
		if (false == fin.good())
		{
			fin.close();
			return false;
		}
		size_t size = FileSize(fin);
		if (0 == size)
		{
			fin.close();
			return false;
		}
		data.resize(size);
		fin.read(reinterpret_cast<char*>(&data[0]), size);

		fin.close();
		return true;
	}
}
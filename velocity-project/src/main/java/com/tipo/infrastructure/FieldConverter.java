package com.tipo.infrastructure;

import java.util.Map;

public class FieldConverter {
	public String convert(Map<String, Object> field) {
		String result = JsonHelper.getHelper().getGson().toJson(field, Map.class);
		return result;
	}	
}
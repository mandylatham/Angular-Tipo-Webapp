package com.tipo.infrastructure;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class JsonHelper {


	private static JsonHelper helper = new JsonHelper();

	public static JsonHelper getHelper() {
		return helper;
	}


	public JsonElement getParsedJson(String json) {
		JsonParser parser = new JsonParser();
		return parser.parse(json);
	}

	public String getJsonString(JsonObject jsonObject) {
		if (jsonObject == null) {
			return null;
		}
		Gson gson = getGson();
		return gson.toJson(jsonObject);
	}

	public String getJsonString(Object obj) {
		if (obj == null) {
			return null;
		}
		Gson gson = getGson();
		return gson.toJson(obj);
	}

	public String getJsonString(Object obj, String name) {
		if (obj == null) {
			return null;
		}
		Gson gson = getGson();
		JsonElement el = gson.toJsonTree(obj);
		JsonObject jObj = new JsonObject();
		jObj.add(name, el);
		return gson.toJson(jObj);
	}

	public Gson getGson() {
		return new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").serializeNulls().create();
	}



	private boolean isEqual(JsonElement source, JsonElement target) {
		boolean result = false;
		if (source == null && target == null) {
			return true;
		}
		if (source == null) {
			return result;
		}
		if (target == null) {
			return result;
		}

		result = source.getAsString().equals(target.getAsString());

		return result;
	}

	public boolean isEmpty(String json) {

		if (json == null || json.trim().equals("") || json.trim().equals("{}")) {
			return true;
		}

		JsonElement element = getParsedJson(json);

		if (element == null) {
			return true;
		}

		if (element.isJsonNull()) {
			return true;
		}

		if (element.isJsonArray() && element.getAsJsonArray().size() == 0) {
			return true;
		}

		if (element.getAsJsonObject() == null) {
			return true;
		}

		if (element.getAsJsonObject().entrySet().size() == 0) {
			return true;
		}

		return false;
	}

	/**
	 * Creates a single Json out of multiple Json objects.
	 * 
	 * @param json
	 * @return
	 */
	public String combineJson(List<String> json) {
		String result = null;
		JsonObject jObj = new JsonObject();

		for (Iterator<String> iterator = json.iterator(); iterator.hasNext();) {
			String string = (String) iterator.next();
			if (string == null || string.trim().equals(""))
				continue;
			JsonElement element = getParsedJson(string);
			for (Map.Entry<String, JsonElement> sourceEntry : element.getAsJsonObject().entrySet()) {
				String key = sourceEntry.getKey();
				JsonElement value = sourceEntry.getValue();
				jObj.add(key, value);
			}
		}
		result = getJsonString(jObj);
		return result;
	}

	public String combineJson(String... json) {
		List<String> jsonList = new ArrayList<String>();
		for (int i = 0; i < json.length; i++) {
			jsonList.add(json[i]);
		}
		return combineJson(jsonList);
	}


}

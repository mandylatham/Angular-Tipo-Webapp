package com.tipo.infrastructure;

import java.util.Map;
import java.util.Base64;

public class FieldConverter {
	public String decodeBase64 (String encoded) {
		byte[] result = Base64.getDecoder().decode(encoded);
		return new String(result);
	}
}
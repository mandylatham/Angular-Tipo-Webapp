package com.tipo.infrastructure;

import java.util.Map;
import java.util.Base64;

public class FieldConverter {
	public String decodeBase64 (String encoded) {
		byte[] result = Base64.getDecoder().decode(encoded);
		return new String(result);
	}
	public String encodeBase64 (String plainstring) {
		byte[] result = Base64.getEncoder().encode(plainstring.getBytes());
		return new String(result);
	}
}
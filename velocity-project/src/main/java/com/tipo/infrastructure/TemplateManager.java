package com.tipo.infrastructure;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.tools.generic.EscapeTool;

public class TemplateManager
{
  protected VelocityEngine velocity = new VelocityEngine();
  
  private static TemplateManager mgr = new TemplateManager();
  
  private TemplateManager()
  {
    // init velocity                                                                                                                                                                                            
    // default resource loader is a file loader on the current directory                                                                                                                                        
    velocity = new VelocityEngine();
    velocity.init();
  }
  
  public static TemplateManager getInstance() {
	  return mgr;
  }

  @SuppressWarnings("unchecked")
public String renderTemplate(String template, Map<String, Object> objects)
  {
    // translate json string to velocity context                                                                                                                                                                
    // (we only need to convey the properties of the root object)
    VelocityContext context = new VelocityContext();
    context.put("esc", new EscapeTool());
    for (Iterator<String> iterator = objects.keySet().iterator(); iterator.hasNext();) {
		String objectName =  iterator.next();
		Object data = objects.get(objectName);
		if (data instanceof String) {
			String stringJson = (String) objects.get(objectName);
		    Map<String, Object> jsonObj = JsonHelper.getHelper().getGson().fromJson(stringJson, Map.class);
			context.put(objectName, jsonObj);
		} else {
			context.put(objectName, data);
		}
	}
 
    Writer writer = new StringWriter();
    velocity.evaluate(context, writer, "TipoTemplateLogs:", template);
    try {
		writer.flush();
	} catch (IOException e) {
		throw new RuntimeException("Failed applying templates");
	}

    return writer.toString();
  }
  


  public static void main(String args[])
  {
    try
    {
      String definition = readFile("src/main/resources/expandedDefinition.json");
//      String definition = readFile("src/main/resources/expandedVelocityDefinition.json");
      String template = readFile("src/main/resources/dedicated-list.tpl.html.vsl");
      Map<String, Object> objs = new HashMap<String, Object>();
			Map<String, Object> jsonObj = JsonHelper.getHelper().getGson().fromJson(definition, Map.class);
      Map<String, Object> definitionObj = (Map<String, Object>) jsonObj.get("data");
      objs.put("definition", definitionObj);
      String result = new TemplateManager().renderTemplate(template, objs);
      String editdefinition = readFile("src/main/resources/expandedVelocityEditDefinition.json");
      String edittemplate = readFile("src/main/resources/dedicated-edit.tpl.html.vsl");
      Map<String, Object> editobjs = new HashMap<String, Object>();
			Map<String, Object> editjsonObj = JsonHelper.getHelper().getGson().fromJson(editdefinition, Map.class);
      Map<String, Object> editdefinitionObj = (Map<String, Object>) editjsonObj.get("data");
      editobjs.put("definition", editdefinitionObj);
      String editresult = new TemplateManager().renderTemplate(edittemplate, editobjs);
      System.out.println(editresult);
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
  }
  
	public static String readFile(String fileName)  {
		String result =null;
		    try {
				result = new String(Files.readAllBytes(Paths.get(fileName)));
			} catch (IOException e) {
				throw new RuntimeException(e);
			} 
		return result;
	}
}
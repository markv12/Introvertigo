
public class WebsocketMessage
{
  public string type;
  public string content;
  public WebsocketMessageMeta meta;
}

public class WebsocketMessageMeta
{
  public long timestamp;
  public WebsocketMessageUser sender;
  public string room;
}

public class WebsocketMessageUser
{
  public string id;
}

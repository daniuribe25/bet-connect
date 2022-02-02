defmodule PlConnect.Plugs.HeaderReq do
  @moduledoc false
  @behaviour Plug

  import Plug.Conn

  def init(opts), do: opts

  def call(conn, [header: header, value: value]) do
    header = get_req_header(conn, header) |> Enum.at(0)
    if header == value do
      conn
    else
      conn
      |> resp(403, "not allowed")
      |> send_resp()
      |> halt()
    end
  end

end
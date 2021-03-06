defmodule PlConnect.Neuron.Connection do
  @behaviour Neuron.Connection

  alias Neuron.{Config, ConfigUtils, JSONParseError, Response}

  @impl Neuron.Connection
  def call(query, options),
      do:
        query
        |> post(options)
        |> handle_response(options)

  def post(query, options) do
    url = options |> url() |> check_url()
    headers = build_headers(options)
      |> Enum.map(fn header ->
        {"#{elem(header, 0)}", elem(header, 1)}
      end)

    client = client(url, headers)
    Tesla.post(
      client,
      "",
      query,
      ConfigUtils.connection_options(options)
    )
  end

  def handle_response(response, options) do
    json_library = ConfigUtils.json_library(options)
    parsed_options = ConfigUtils.parse_options(options)
    handle(response, json_library, parsed_options)
  end

  defp url(options), do: Keyword.get(options, :url) || Config.get(:url)

  defp check_url(nil), do: raise(ArgumentError, message: "you need to supply an url")
  defp check_url(url), do: url

  defp build_headers(options),
       do: Keyword.merge(["Content-Type": "application/json"], headers(options))

  defp headers(options), do: Keyword.get(options, :headers, Config.get(:headers) || [])

  defp handle(response, json_library, parse_options)

  defp handle({:ok, response}, json_library, parse_options) do
    case json_library.decode(response.body, parse_options) do
      {:ok, body} -> build_response_tuple(%{response | body: body})
      {:error, error} -> handle_unparsable(response, error)
      {:error, error, _} -> handle_unparsable(response, error)
    end
  end

  defp handle({:error, _} = response, _, _), do: response

  defp build_response_tuple(%{status: 200} = response) do
    {
      :ok,
      build_response(response)
    }
  end

  defp build_response_tuple(response) do
    {
      :error,
      build_response(response)
    }
  end

  defp build_response(response) do
    %Response{
      status_code: response.status,
      body: response.body,
      headers: response.headers
    }
  end

  defp handle_unparsable(response, error) do
    {
      :error,
      %JSONParseError{
        response: build_response(response),
        error: error
      }
    }
  end

  defp client(url, headers) do
    middleware = [
      {Tesla.Middleware.BaseUrl, url},
      {Tesla.Middleware.Headers, headers}
    ]

    Tesla.client(middleware)
  end
end

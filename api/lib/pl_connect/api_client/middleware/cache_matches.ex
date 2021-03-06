defmodule PlConnect.ApiClient.Middleware.CacheMatches do
  @moduledoc false

  @behaviour Tesla.Middleware

  def call(env, next, ttl: ttl) do
    env
    |> get_from_cache(env.method)
    |> run(next)
    |> set_to_cache(ttl)
  end

  # do not cache the first query since the results might change
  defp get_from_cache(%Tesla.Env{url: _, query: [type: "wz"]} = env, :get) do
    {nil, env}
  end

  # do not cache search
  defp get_from_cache(
         %Tesla.Env{url: "https://api.tracker.gg/api/v2/warzone/standard/search", query: _} = env,
         :get
       ) do
    {nil, env}
  end

  defp get_from_cache(env, :get) do
    {Cachex.get!(:tesla_cache_cachex, cache_key(env)), env}
  end

  defp get_from_cache(env, _), do: {nil, env}

  defp run({nil, env}, next) do
    {:ok, env} = Tesla.run(env, next)
    {:miss, env}
  end

  defp run({cached_env, _env}, _next) do
    {:hit, cached_env}
  end

  defp set_to_cache({:miss, %Tesla.Env{status: status} = env}, ttl) when status == 200 do
    Cachex.put(:tesla_cache_cachex, cache_key(env), env, ttl: ttl)
    {:ok, env}
  end

  defp set_to_cache({:miss, env}, _ttl), do: {:ok, env}
  defp set_to_cache({:hit, env}, _ttl), do: {:ok, env}

  defp cache_key(%Tesla.Env{url: url, query: query}), do: Tesla.build_url(url, query)
end

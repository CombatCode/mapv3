defmodule WorkerTest do
  use ExUnit.Case
  use Amnesia
  doctest Longpoll.Worker

  use CacheDatabase, as: CD

  setup_all do
  	Amnesia.start
    CacheDatabase.create(ram: [node])
    {:ok, pid} = Longpoll.Worker.start_link
  	{:ok, pid: pid}
  end


  test "checkmnesia" do
  	Amnesia.transaction do
	     %UserRegister{username: "TEST1", register: MapSet.new([])} |> UserRegister.write
	     %UserRegister{username: "TEST2", register: MapSet.new([])} |> UserRegister.write
	     %UserRegister{username: "TEST3", register: MapSet.new([])} |> UserRegister.write
	     %UserRegister{username: "TEST4", register: MapSet.new([])} |> UserRegister.write
	end 
	read_value = Amnesia.transaction do
  		UserRegister.read("TEST4")
  	end
    assert read_value == %UserRegister{username: "TEST4", register: MapSet.new()}
  end

  test "subscriber", state do
    subscriber_id = Longpoll.Worker.get(state[:pid], :subscriber_id)
    assert subscriber_id != nil
  end
  
  @tag timeout: 60000000
  test "poll", state do
  	Longpoll.Worker.add_filter(state[:pid])
  	poll_state = collect_poll(state[:pid], 0, 100)
  	assert poll_state == {:ok}
  end

  def collect_poll(pid, counter, counter_limit) do 
  	ps_ = Longpoll.Worker.poll(pid)
  	# IO.inspect(ps_)
  	if counter < counter_limit do
	  	if Enum.count(ps_) > 0 do
	  		collect_poll(pid, counter + 1, counter_limit)
	  	else
	  		ps_
	  	end
  	else
  		{:ok}
  	end
  end
end
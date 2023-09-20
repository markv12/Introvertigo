using System;
using System.IO;
public struct BufferedBinaryReader : IDisposable
{
	private readonly Stream stream;
	private readonly byte[] buffer;
	private readonly int bufferSize;
	private int bufferOffset;
	private int numBufferedBytes;

	public BufferedBinaryReader(Stream stream, byte[] _buffer)
	{
		this.stream = stream;
		buffer = _buffer;
		this.bufferSize = buffer.Length;
		bufferOffset = bufferSize;
		numBufferedBytes = 0;
		FillBuffer();
	}

	public int NumBytesAvailable { get { return Math.Max(0, numBufferedBytes - bufferOffset); } }

	public bool FillBuffer()
	{
		var numBytesUnread = bufferSize - bufferOffset;
		var numBytesToRead = bufferSize - numBytesUnread;
		bufferOffset = 0;
		numBufferedBytes = numBytesUnread;
		if (numBytesUnread > 0)
		{
			Buffer.BlockCopy(buffer, numBytesToRead, buffer, 0, numBytesUnread);
		}
		while (numBytesToRead > 0)
		{
			var numBytesRead = stream.Read(buffer, numBytesUnread, numBytesToRead);
			if (numBytesRead == 0)
			{
				return false;
			}
			numBufferedBytes += numBytesRead;
			numBytesToRead -= numBytesRead;
			numBytesUnread += numBytesRead;
		}
		return true;
	}

	public ushort ReadUInt16()
	{
		ushort val = (ushort)((int)buffer[bufferOffset] | (int)buffer[bufferOffset + 1] << 8);
		bufferOffset += 2;
		return val;
	}

	public uint ReadUInt32()
	{
		uint val = (uint)(buffer[bufferOffset] | buffer[bufferOffset + 1] << 8 | buffer[bufferOffset + 2] << 16 | buffer[bufferOffset + 3] << 24);
		bufferOffset += 4;
		return val;
	}

	public int ReadInt32()
	{
		int val = (int)(buffer[bufferOffset] | buffer[bufferOffset + 1] << 8 | buffer[bufferOffset + 2] << 16 | buffer[bufferOffset + 3] << 24);
		bufferOffset += 4;
		return val;
	}

	public void Dispose()
	{
		stream.Close();
	}
}
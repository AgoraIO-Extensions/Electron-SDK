//
//  Share memory IPC
//
//  Created by Ender Zheng in 2018-1
//  Copyright (c) 2018 Agora IO. All rights reserved.
//

#ifndef IPC_SHM_H
#define IPC_SHM_H

#include <string>
#include <stdint.h>
#include <vector>

/**
 * Interface of share memory operation
 * Different OS has different implementation
 */
class native_shm_interface
{
public:

	/**
	 * create a named share memory
	 * @param [in]name: name of the shared memory
	 * @param [in]size: size of the shared memory
	 * @return: 0 if success, negative value if fail
	 */
	virtual int create(const std::string& name, int64_t size) = 0;

	/**
	 * remove a named share memory
	 * @param [in]name: name of the share memory
	 * @return: 0 if success, negative value if fail
	 */
	virtual int remove(const std::string& name) = 0;

	/**
	 * open a named share memory
	 * @param [in]name: name of the share memory
	 * @return: 0 if success, negative value if fail
	 */
	virtual int open(const std::string& name) = 0;

	/**
	 * close a named share memory
	 * @return: 0 if success, negative value if fail
	 */
	virtual int close() = 0;

	/**
	 * raw address of mapped share memory
	 * @return: address if success, NULL if no share memory mapped
	 */
	virtual void *address() = 0;

	/**
	 * size of the share memory
	 * @return: size if success, 0 if no share memory mapped
	 */
	virtual int64_t size() = 0;

	virtual ~native_shm_interface() {}
};

enum CHANNEL_OPEN_MODE
{
	CHANNEL_READ = 1,
	CHANNEL_WRITE
};


#ifndef WIN32

#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>
#include <unistd.h>
#include <sched.h>
#include <sys/time.h>

#define AtomicTestAndSet(x, y) __sync_lock_test_and_set((x), (y))
#define AtomicAddAndFetch(x, y) __sync_add_and_fetch((x), (y))
#define AtomicFetchAndAdd(x, y) __sync_fetch_and_add((x), (y))
#define AtomicGet(x) AtomicAddAndFetch(x, 0)
#define YIELD() msleep(20);
//sched_yield()
#define ARRAY_ANY_SIZE 0
static inline void msleep(long ms)
{
    struct timespec sp;
    sp.tv_sec = 0;
    sp.tv_nsec = ms * 1000000;
    nanosleep(&sp, NULL);
}

class posix_shm : public native_shm_interface
{
public:
    posix_shm() : fd(-1), addr(NULL), region_size(0)
    {
    }

    ~posix_shm()
    {
        close();
    }

    int create(const std::string &name, int64_t size)  override
    {
        int fd = ::shm_open(name.c_str(), O_RDWR | O_CREAT | O_EXCL, S_IRUSR | S_IWUSR);
        if ((fd == -1) && (errno == EEXIST)) {
            // maybe recoverable
            remove(name);
            fd = ::shm_open(name.c_str(), O_RDWR | O_CREAT, S_IRUSR | S_IWUSR);
        }

        if (fd == -1)
            return -1;
        
        int flag = fcntl(fd, F_GETFD);
        flag &= ~FD_CLOEXEC;
        fcntl(fd, F_SETFD, flag);

        // this will make a region and fill it with zero
        int ret = ::ftruncate(fd, size);
        ::close(fd);
        return ret;
    }

    int remove(const std::string &name)  override
    {
        return ::shm_unlink(name.c_str());
    }

    int open(const std::string &name)  override
    {
        fd = ::shm_open(name.c_str(), O_RDWR, S_IRUSR | S_IWUSR);
        if (fd == -1)
            return -1;

        struct stat s = { 0 };
        int ret = ::fstat(fd, &s);
        if (ret == -1) {
            goto fail;
        }

        region_size = s.st_size;
        addr = ::mmap(NULL, region_size, (PROT_READ | PROT_WRITE), MAP_SHARED, fd, 0);
        if (addr == MAP_FAILED) {
            goto fail;
        }
        return 0;
    fail:
        ::close(fd);
        fd = -1;
        addr = NULL;
        region_size = 0;
        return -1;
    }

    int close()  override
    {
        if (addr != MAP_FAILED)
            ::munmap(addr, region_size);

        if (fd != -1)
            ::close(fd);

        fd = -1;
        addr = NULL;
        region_size = 0;
        return 0;
    }

    void *address()  override
    {
        return addr;
    }

    int64_t size()  override
    {
        return region_size;
    }

private:
    int fd;
    void *addr;
    off_t region_size;
};

#else // WIN32
#include <Windows.h>

#define AtomicTestAndSet(x, y) InterlockedExchange64((LONG64*)(x), (y))
#define AtomicAddAndFetch(x, y) (InterlockedExchangeAdd64((LONG64*)(x), (y)) + (y))
#define AtomicFetchAndAdd(x, y) (InterlockedExchangeAdd64((LONG64*)(x), (y)))
#define AtomicGet(x) AtomicFetchAndAdd(x, 0)
#define YIELD() Sleep(1)
#define ARRAY_ANY_SIZE 1

static void msleep(long ms)
{
    Sleep((DWORD)ms);
}

class win32_shm : public native_shm_interface
{
public:
    win32_shm() :
        creator_file_handle(NULL),
        open_file_handle(NULL),
        region_size(0),
        addr(NULL)
    {
    }

    ~win32_shm()
    {
        close();
    }

    int create(const std::string& name, int64_t size) override
    {
        creator_file_handle = ::CreateFileMappingA(NULL, NULL, PAGE_READWRITE, 0, (DWORD)size, name.c_str());
        if (creator_file_handle == NULL)
            return -1;

        return 0;
    }


    int remove(const std::string& name) override
    {
        // doesn't really remove the share memory until all handle closed
        if (creator_file_handle != NULL) {
            ::CloseHandle(creator_file_handle);
            creator_file_handle = NULL;
        }
        return 0;
    }


    int open(const std::string& name) override
    {
        open_file_handle = ::OpenFileMappingA(FILE_MAP_READ | FILE_MAP_WRITE, FALSE, name.c_str());
        if (open_file_handle == NULL)
            return -1;

        addr = ::MapViewOfFile(open_file_handle, FILE_MAP_READ | FILE_MAP_WRITE, 0, 0, 0);
        if (addr == NULL) {
            close();
            return -1;
        }

        MEMORY_BASIC_INFORMATION info = { 0 };
        SIZE_T ret = VirtualQuery(addr, &info, sizeof(info));
        if (ret == 0) {
            close();
            return -1;
        }
        region_size = info.RegionSize;

        return 0;
    }


    int close() override
    {
        if (addr) {
            UnmapViewOfFile(addr);
            addr = NULL;
            region_size = 0;
        }

        if (open_file_handle != NULL) {
            ::CloseHandle(open_file_handle);
            open_file_handle = NULL;
        }

        return 0;
    }


    void * address() override
    {
        return addr;
    }

    int64_t size() override
    {
        return region_size;
    }

private:

    HANDLE creator_file_handle;
    HANDLE open_file_handle;
    int64_t region_size;
    PVOID addr;

};

#endif

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
class shm_ipc
{
public:
	shm_ipc();
	virtual ~shm_ipc();

	/**
	 * create a named share memory
	 * @param [in]name: name of the shared memory
	 * @param [in]channel_count: How many channels can be used to transfer
	 *                           data. Channel is dual band. A user can
	 *                           get fd pair using method open_channel
	 * @return: 0 if success, negative value if fail
	 */
	int create(const std::string& name, int64_t channel_count);

	/**
	 * remove a named share memory
	 * @param [in]name: name of the share memory
	 * @return: 0 if success, negative value if fail
	 */
	int remove(const std::string& name);

	/**
	 * open a named share memory
	 * @param [in]name: name of the share memory
	 * @return: 0 if success, negative value if fail
	 */
	int open(const std::string& name);

	/**
	 * close a named share memory
	 * @return: 0 if success, negative value if fail
	 */
	int close();

	/**
	 * open a channel communication
	 * @param [in]id: channel id
	 * @param [in]mode: open mode
	 CHANNEL_READ:  open channel to read
	 CHANNEL_WRITE: open channel to write
	 * NOTE: each mode can only be opened once, otherwise return -1
	 * @return: 0 if success, negative value if fail
	 */
	int open_channel(int id, CHANNEL_OPEN_MODE mode);

	/**
	 * close a communication channel
	 * @param [in]id: channel id
	 * @param [in]mode: channel mode
	 *					CHANNEL_READ:  close channel of read
	 *					CHANNEL_WRITE: close channel of write
	 * @return: 0 if success, negative value if fail
	 */
	int close_channel(int id, CHANNEL_OPEN_MODE mode);

	/**
	 * force stop both read end and write end
	 * @param [in]id: channel id
	 * @return: 0 if success, negative value if fail
	 */
	int force_stop_channel(int id);

	/**
	 * write data into a channel
	 * @param [in]fd: fd for a channel returned from open_channel
	 * @param [in]buf: address of the buffer
	 * @param [in]size: size of the buffer
	 * @return: return actually written size if success, negative value if fail
	 * NOTE: close channel CHANNEL_WRITE mode will make this return -1 immediately
	 *		 this function will wait until reader pop up some data, no matter
	 *		 read end opened or not
	 */
	int32_t write(int fd, const void *buf, int32_t size);

    /**
    * Write multiple data into a channel block
    * @param [in]fd: fd for a channel returned from open_channel
    * @param [in]bufs : the buffers to be written to the same block
    */
    int32_t write(int fd, const std::vector<std::pair<char*, int32_t>>& bufs);

	/**
	 * read data from a channel
	 * @param [in]fd: fd for a channel returned from open_channel
	 * @param [in,out]buf: address of the buffer
	 * @param [in]size: size of the buffer
	 * @return: return actually read size if success, negative value if fail
	 * NOTE: close channel CHANNEL_READ  mode will make this return -1 immediately
	 *		 this function will wait until writer push some some data, no matter
	 *		 write end opened or not
	 */
	int32_t read(int fd, void *buf, int32_t size);

	/**
	 * get the address of shared memory
	 * @return: return actually written size if success, negative value if fail
	 */
	void *raw_buffer();

	/**
	 * get the size of shared memory
	 * @return: return actually written size if success, negative value if fail
	 */
	int64_t size();

private:
	native_shm_interface *shmOp;
};

//#define BLOCK_SIZE (1 * 32 * 1024)
//#define BLOCK_PER_CHANNEL 32

template<uint32_t BLOCK_SIZE>
struct shm_block
{
    int64_t lock;
    int64_t data_available;
    int64_t amount;
    int64_t channel_offset;
    unsigned char buf[BLOCK_SIZE];
};

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
struct shm_channel
{
    int64_t used;
    int64_t read_opened;
    int64_t write_opened;
    uint64_t writen_count;
    uint64_t read_count;
    int64_t header_offset;
    // multiple buffers so we can pipe line
    // read and write on the same channel
    shm_block<BLOCK_SIZE> block[BLOCK_NUM];
};

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
struct shm_header
{
    int64_t size;
    int64_t channel_count;
    shm_channel<BLOCK_NUM, BLOCK_SIZE> channels[ARRAY_ANY_SIZE];
};

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
static shm_channel<BLOCK_NUM, BLOCK_SIZE> *shm_block_get_channel(shm_block<BLOCK_SIZE> *block)
{
    unsigned char *addr = (unsigned char *)block;
    shm_channel<BLOCK_NUM, BLOCK_SIZE> *channel = (shm_channel<BLOCK_NUM, BLOCK_SIZE> *)(addr - block->channel_offset);
    return channel;
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
static shm_header<BLOCK_NUM, BLOCK_SIZE> *shm_channel_get_header(shm_channel<BLOCK_NUM, BLOCK_SIZE> *channel)
{
    unsigned char *addr = (unsigned char *)channel;
    shm_header<BLOCK_NUM, BLOCK_SIZE> *header = (shm_header<BLOCK_NUM, BLOCK_SIZE> *)(addr - channel->header_offset);
    return header;
}

/**
* helper functions for shm_block
*/
template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
static int shm_block_lock(shm_block<BLOCK_SIZE> *block)
{
    int retry_count = 0;

    // == 1: it is previously 1 and we set it to 1, means state not changed
    // == 0: it is previously 0 and we set it to 1, means we get the lock
    while (AtomicTestAndSet(&block->lock, 1) == 1) {
        // if channel not available during wait, return error
        if (AtomicGet(&(shm_block_get_channel<BLOCK_NUM, BLOCK_SIZE>(block)->used)) == 0)
            return -1;

        // loop locally for some time, so we can avoid sleep system call
        // we assume the lock test fails quite little because use have
        // more than one buffers for one channel, so we can pipe line the
        // read and write operation
        //retry_count++;
        //if (retry_count > 20) {
         //   retry_count = 0;
            YIELD();
        //}
    }

    // check again after lock acquired
    // if channel not available during wait, return error
    if (AtomicGet(&(shm_block_get_channel<BLOCK_NUM, BLOCK_SIZE>(block)->used)) == 0) {
        AtomicTestAndSet(&block->lock, 0);
        return -1;
    }

    return 0;
}

template<uint32_t BLOCK_SIZE>
static void shm_block_unblock(shm_block<BLOCK_SIZE> *block)
{
    AtomicTestAndSet(&block->lock, 0);
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
static int shm_block_wait_for_data_state(shm_block<BLOCK_SIZE> *block, int64_t state)
{
    int retry_count = 0;
    shm_channel<BLOCK_NUM, BLOCK_SIZE> *channel = shm_block_get_channel<BLOCK_NUM, BLOCK_SIZE>(block);
    shm_header<BLOCK_NUM, BLOCK_SIZE> *header = shm_channel_get_header<BLOCK_NUM, BLOCK_SIZE>(channel);

    while (1) {
        if (shm_block_lock<BLOCK_NUM, BLOCK_SIZE>(block) != 0)
            return -1;

        // check read opened on read operation
        // this can make read operation return immediately after
        // closing read end of the channel
        if (state == 1 && AtomicGet(&channel->read_opened) == 0)
            return -1;

        // check write opened on write operation
        // this can make write operation return immediately after
        // closing write end of the channel
        if (state == 0 && AtomicGet(&channel->write_opened) == 0)
            return -1;

        if (AtomicGet(&block->data_available) == state) {
            // state is what we expected, we done
            // do not release lock because we are going to read/write data
            break;
        }
        else {
            // continue loop
            shm_block_unblock<BLOCK_SIZE>(block);
            retry_count++;
            if (retry_count > 20) {
                retry_count = 0;
                YIELD();
            }
        }
    }
    return 0;
}

/**
* Helper functions for channel
*/
template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
static void init_channel(shm_header<BLOCK_NUM, BLOCK_SIZE> *header, shm_channel<BLOCK_NUM, BLOCK_SIZE> *channel)
{
    channel->header_offset = (unsigned char *)channel - (unsigned char *)header;
    channel->writen_count = 0;
    channel->read_count = 0;
    channel->read_opened = 0;
    channel->write_opened = 0;
    for (unsigned int j = 0; j < BLOCK_NUM; j++) {
        channel->block[j].amount = 0;
        channel->block[j].data_available = 0;
        channel->block[j].lock = 0;
        channel->block[j].channel_offset =
            (unsigned char *)&channel->block[j] - (unsigned char *)channel;
        memset(channel->block[j].buf, 0, BLOCK_SIZE);
    }
}

/**
* implementation of shm_ipc
*/
class win32_shm;
template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
shm_ipc<BLOCK_NUM, BLOCK_SIZE>::shm_ipc()
{
#ifndef WIN32
    shmOp = new posix_shm();
#else
    shmOp = new win32_shm();
#endif
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
shm_ipc<BLOCK_NUM, BLOCK_SIZE>::~shm_ipc()
{
    delete shmOp;
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int shm_ipc<BLOCK_NUM, BLOCK_SIZE>::create(const std::string &name, int64_t channel_count)
{
    // creator needs to initialize the share buffer
    int64_t total_size = sizeof(shm_header<BLOCK_NUM, BLOCK_SIZE>) +
        channel_count  * sizeof(shm_channel<BLOCK_NUM, BLOCK_SIZE>);
    int ret = shmOp->create(name, total_size);
    if (ret != 0)
        return ret;

    ret = shmOp->open(name);
    if (ret != 0) {
        shmOp->remove(name);
        return ret;
    }

    shm_header<BLOCK_NUM, BLOCK_SIZE> *header = (shm_header<BLOCK_NUM,BLOCK_SIZE> *)shmOp->address();
    header->channel_count = channel_count;
    header->size = total_size;
    for (int i = 0; i < header->channel_count; i++) {
        header->channels[i].used = 0;
        init_channel<BLOCK_NUM, BLOCK_SIZE>(header, &header->channels[i]);
    }

    ret = shmOp->close();

    return ret;
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int shm_ipc<BLOCK_NUM, BLOCK_SIZE>::remove(const std::string &name)
{
    return shmOp->remove(name);
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int shm_ipc<BLOCK_NUM, BLOCK_SIZE>::open(const std::string &name)
{
    return shmOp->open(name);
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int shm_ipc<BLOCK_NUM, BLOCK_SIZE>::close()
{
    return shmOp->close();
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int shm_ipc<BLOCK_NUM, BLOCK_SIZE>::open_channel(int id, CHANNEL_OPEN_MODE mode)
{
    shm_header<BLOCK_NUM, BLOCK_SIZE> *header = (shm_header<BLOCK_NUM, BLOCK_SIZE> *)shmOp->address();

    if (!header)
        return -1;

    if (id < 0 || id > header->channel_count)
        return -1;


    if (AtomicGet(&header->channels[id].used) &&
        AtomicGet(&header->channels[id].read_opened) &&
        AtomicGet(&header->channels[id].write_opened))
        return -1;

    if ((mode == CHANNEL_READ) &&
        AtomicGet(&header->channels[id].read_opened))
        return -1;

    if ((mode == CHANNEL_WRITE) &&
        AtomicGet(&header->channels[id].write_opened))
        return -1;

    if (mode == CHANNEL_READ) {
        AtomicTestAndSet(&header->channels[id].read_opened, 1);
    }
    else if (mode == CHANNEL_WRITE) {
        AtomicTestAndSet(&header->channels[id].write_opened, 1);
    }
    else {
        return -1;
    }

    AtomicTestAndSet(&header->channels[id].used, 1);
    return 0;
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int shm_ipc<BLOCK_NUM, BLOCK_SIZE>::close_channel(int id, CHANNEL_OPEN_MODE mode)
{
    shm_header<BLOCK_NUM, BLOCK_SIZE> *header = (shm_header<BLOCK_NUM, BLOCK_SIZE> *)shmOp->address();
    if (!header)
        return -1;

    if (id < 0 || id > header->channel_count)
        return -1;

    if ((mode == CHANNEL_READ) &&
        !AtomicGet(&header->channels[id].read_opened))
        return -1;

    if ((mode == CHANNEL_WRITE) &&
        !AtomicGet(&header->channels[id].write_opened))
        return -1;

    if (mode == CHANNEL_READ)
        AtomicTestAndSet(&header->channels[id].read_opened, 0);
    else if (mode == CHANNEL_WRITE)
        AtomicTestAndSet(&header->channels[id].write_opened, 0);
    else
        return -1;

    if (AtomicGet(&header->channels[id].read_opened) == 0 &&
        AtomicGet(&header->channels[id].write_opened) == 0)
        AtomicTestAndSet(&header->channels[id].used, 0);

    return 0;
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int shm_ipc<BLOCK_NUM, BLOCK_SIZE>::force_stop_channel(int id)
{
    shm_header<BLOCK_NUM, BLOCK_SIZE> *header = (shm_header<BLOCK_NUM, BLOCK_SIZE> *)shmOp->address();
    if (!header)
        return -1;

    if (id < 0 || id > header->channel_count)
        return -1;

    AtomicTestAndSet(&header->channels[id].read_opened, 0);
    AtomicTestAndSet(&header->channels[id].write_opened, 0);
    AtomicTestAndSet(&header->channels[id].used, 0);
    return 0;
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int32_t shm_ipc<BLOCK_NUM, BLOCK_SIZE>::write(int fd, const void *buf, int32_t size)
{
    shm_header<BLOCK_NUM, BLOCK_SIZE> *header = (shm_header<BLOCK_NUM, BLOCK_SIZE> *)shmOp->address();
    if (fd < 0 || fd > header->channel_count)
        return -1;

    shm_channel<BLOCK_NUM, BLOCK_SIZE> *channel = &header->channels[fd];
    if (AtomicGet(&channel->used) != 1 ||
        AtomicGet(&channel->write_opened) != 1)
        return -1;

    unsigned char *src_buf = (unsigned char *)buf;

    int64_t write_idx = AtomicFetchAndAdd(&channel->writen_count, 1);
    write_idx %= BLOCK_NUM;

    shm_block<BLOCK_SIZE> *block = &channel->block[write_idx];
    int32_t write_size = (size > BLOCK_SIZE) ? BLOCK_SIZE : size;

    // wait on block data read by remote (data_available == 0)
    // we hold the block lock after this function returns success
    int ret = shm_block_wait_for_data_state<BLOCK_NUM, BLOCK_SIZE>(block, 0);
    if (ret != 0) {
        AtomicAddAndFetch(&channel->writen_count, -1);
        return -1;
    }

    memcpy(block->buf, src_buf, write_size);
    block->amount = write_size;
    block->data_available = 1;
    shm_block_unblock<BLOCK_SIZE>(block);

    return write_size;
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int32_t shm_ipc<BLOCK_NUM, BLOCK_SIZE>::write(int fd, const std::vector<std::pair<char*, int32_t>>& bufs)
{
    shm_header<BLOCK_NUM, BLOCK_SIZE> *header = (shm_header<BLOCK_NUM, BLOCK_SIZE> *)shmOp->address();
    if (fd < 0 || fd > header->channel_count)
        return -1;

    shm_channel<BLOCK_NUM, BLOCK_SIZE> *channel = &header->channels[fd];
    if (AtomicGet(&channel->used) != 1 ||
        AtomicGet(&channel->write_opened) != 1)
        return -1;

    int64_t write_idx = AtomicFetchAndAdd(&channel->writen_count, 1);
    write_idx %= BLOCK_NUM;

    shm_block<BLOCK_SIZE> *block = &channel->block[write_idx];
    int32_t left_block_size = BLOCK_SIZE;

    // wait on block data read by remote (data_available == 0)
    // we hold the block lock after this function returns success
    int ret = shm_block_wait_for_data_state<BLOCK_NUM, BLOCK_SIZE>(block, 0);
    if (ret != 0) {
        AtomicAddAndFetch(&channel->writen_count, -1);
        return -1;
    }
    int32_t written_size = 0;
    int32_t write_size = 0;
    for (auto& buf : bufs){
        write_size = (buf.second > left_block_size) ? left_block_size : buf.second;
        memcpy(block->buf + written_size, buf.first, write_size);
        written_size += write_size;
        left_block_size -= write_size;
        if (left_block_size <= 0)
            break;
    }
    block->amount = written_size;
    block->data_available = 1;
    shm_block_unblock<BLOCK_SIZE>(block);

    return written_size;
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int32_t shm_ipc<BLOCK_NUM, BLOCK_SIZE>::read(int fd, void *buf, int32_t size)
{
    shm_header<BLOCK_NUM, BLOCK_SIZE> *header = (shm_header<BLOCK_NUM, BLOCK_SIZE> *)shmOp->address();
    if (fd < 0 || fd > header->channel_count)
        return -1;

    shm_channel<BLOCK_NUM, BLOCK_SIZE> *channel = &header->channels[fd];
    if (AtomicGet(&channel->used) != 1 ||
        AtomicGet(&channel->read_opened) != 1)
        return -1;

    int64_t read_idx = AtomicFetchAndAdd(&channel->read_count, 1);
    read_idx %= BLOCK_NUM;

    shm_block<BLOCK_SIZE> *block = &channel->block[read_idx];
    int32_t read_size = 0;

    // wait on block data wrote by remote (data_available == 1)
    // we hold the block lock after this function returns success
    int ret = shm_block_wait_for_data_state<BLOCK_NUM, BLOCK_SIZE>(block, 1);
    if (ret != 0) {
        AtomicFetchAndAdd(&channel->read_count, -1);
        return -1;
    }

    read_size = (int32_t)((size > block->amount) ? block->amount : size);
    memcpy(buf, block->buf, read_size);
    block->amount -= read_size;
    if (block->amount > 0)
        AtomicFetchAndAdd(&channel->read_count, -1);
    else
        block->data_available = 0;
    shm_block_unblock<BLOCK_SIZE>(block);

    return read_size;
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
void *shm_ipc<BLOCK_NUM, BLOCK_SIZE>::raw_buffer()
{
    return shmOp->address();
}

template<uint32_t BLOCK_NUM, uint32_t BLOCK_SIZE>
int64_t shm_ipc<BLOCK_NUM, BLOCK_SIZE>::size()
{
    return shmOp->size();
}

#endif
